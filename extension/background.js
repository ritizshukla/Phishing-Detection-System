const safeBypassByTab = new Map();
const inFlightByTab = new Map();
const predictionCache = new Map();
const recentBypassByTab = new Map();

const CACHE_TTL_MS = 60 * 1000;
const REQUEST_TIMEOUT_MS = 2500;
const BYPASS_STORAGE_KEY = "tabBypassTickets";
const BYPASS_TTL_MS = 20 * 1000;
const BYPASS_GRACE_MS = 4500;

function saveScanState(state) {
  chrome.storage.local.set({
    lastScan: {
      timestamp: Date.now(),
      ...state
    }
  });
}

async function allowUrlOnce(tabId, url) {
  safeBypassByTab.set(tabId, url);
  recentBypassByTab.set(tabId, {
    url,
    expiresAt: Date.now() + BYPASS_GRACE_MS
  });

  const stored = await chrome.storage.local.get([BYPASS_STORAGE_KEY]);
  const tickets = stored[BYPASS_STORAGE_KEY] || {};
  tickets[String(tabId)] = {
    url,
    expiresAt: Date.now() + BYPASS_TTL_MS
  };

  await chrome.storage.local.set({
    [BYPASS_STORAGE_KEY]: tickets
  });
}

async function consumeBypassTicket(tabId, url) {
  const recentBypass = recentBypassByTab.get(tabId);
  if (recentBypass) {
    if (Date.now() < recentBypass.expiresAt && recentBypass.url === url) {
      return true;
    }
    if (Date.now() >= recentBypass.expiresAt) {
      recentBypassByTab.delete(tabId);
    }
  }

  const memoryUrl = safeBypassByTab.get(tabId);
  if (memoryUrl && memoryUrl === url) {
    safeBypassByTab.delete(tabId);
    recentBypassByTab.set(tabId, {
      url,
      expiresAt: Date.now() + BYPASS_GRACE_MS
    });
    return true;
  }

  const stored = await chrome.storage.local.get([BYPASS_STORAGE_KEY]);
  const tickets = stored[BYPASS_STORAGE_KEY] || {};
  const ticket = tickets[String(tabId)];
  if (!ticket) return false;

  // Cleanup expired ticket whenever we read it.
  if (Date.now() >= ticket.expiresAt) {
    delete tickets[String(tabId)];
    await chrome.storage.local.set({ [BYPASS_STORAGE_KEY]: tickets });
    return false;
  }

  if (ticket.url !== url) return false;

  delete tickets[String(tabId)];
  await chrome.storage.local.set({ [BYPASS_STORAGE_KEY]: tickets });
  recentBypassByTab.set(tabId, {
    url,
    expiresAt: Date.now() + BYPASS_GRACE_MS
  });
  return true;
}

function isSupportedUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

function isInternalUrl(url) {
  return (
    url.startsWith("chrome://") ||
    url.startsWith("edge://") ||
    url.includes("warning.html") ||
    url.includes("safe.html")
  );
}

function normalizeResult(data) {
  const confidence = Number.isFinite(data?.confidence) ? data.confidence : 0;
  const prediction = data?.prediction === 1 ? 1 : 0;
  const explanation = Array.isArray(data?.explanation) ? data.explanation : [];
  return { confidence, prediction, explanation };
}

function getCachedPrediction(url) {
  const cached = predictionCache.get(url);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    predictionCache.delete(url);
    return null;
  }

  return cached.data;
}

function setCachedPrediction(url, data) {
  predictionCache.set(url, {
    timestamp: Date.now(),
    data
  });
}

function buildWarningUrl(targetUrl, confidence, explanation) {
  const risk = Math.max(0, Math.min(100, confidence * 100));
  const compactExplanation = explanation
    .filter(item => typeof item === "string")
    .slice(0, 5)
    .map(item => item.slice(0, 180));

  return chrome.runtime.getURL(
    "warning/warning.html?url=" + encodeURIComponent(targetUrl) +
    "&risk=" + encodeURIComponent(String(risk)) +
    "&exp=" + encodeURIComponent(JSON.stringify(compactExplanation))
  );
}

async function isTabStillOnUrl(tabId, expectedUrl) {
  try {
    const tab = await chrome.tabs.get(tabId);
    return tab?.url === expectedUrl;
  } catch {
    return false;
  }
}

async function routeToResult(tabId, url, result) {
  const confidence = Number.isFinite(result.confidence) ? result.confidence : 0;

  if (result.prediction === 1) {
    saveScanState({
      status: "phishing",
      url,
      confidence,
      prediction: 1,
      explanation: result.explanation
    });

    const warningPage = buildWarningUrl(url, confidence, result.explanation);
    await chrome.tabs.update(tabId, { url: warningPage });
    return;
  }

  const safeScore = Math.max(0, Math.min(100, (1 - confidence) * 100));
  const seconds = 3;

  saveScanState({
    status: "safe",
    url,
    confidence,
    prediction: 0,
    safeScore
  });

  await allowUrlOnce(tabId, url);

  const safePage = chrome.runtime.getURL(
    "safe/safe.html?url=" + encodeURIComponent(url) +
    "&safeScore=" + encodeURIComponent(String(safeScore)) +
    "&seconds=" + encodeURIComponent(String(seconds))
  );

  await chrome.tabs.update(tabId, { url: safePage });
}

async function fetchPrediction(url, signal) {
  const res = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url }),
    signal
  });

  if (!res.ok) {
    throw new Error(`Prediction API failed with status ${res.status}`);
  }

  return res.json();
}

async function processUrl(tabId, url) {
  if (!url || !isSupportedUrl(url) || isInternalUrl(url)) return;

  if (await consumeBypassTicket(tabId, url)) {
    return;
  }

  const pending = inFlightByTab.get(tabId);
  if (pending?.url === url) return;
  if (pending && pending.url !== url) {
    pending.controller.abort();
  }

  const cached = getCachedPrediction(url);
  if (cached) {
    await routeToResult(tabId, url, cached);
    return;
  }

  saveScanState({
    status: "checking",
    url
  });

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  inFlightByTab.set(tabId, { url, controller });

  try {
    const data = await fetchPrediction(url, controller.signal);
    const result = normalizeResult(data);
    setCachedPrediction(url, result);

    if (!(await isTabStillOnUrl(tabId, url))) return;

    await routeToResult(tabId, url, result);
  } catch (err) {
    if (controller.signal.aborted) return;

    saveScanState({
      status: "error",
      url,
      error: String(err)
    });
    console.error("API Error:", err);
  } finally {
    clearTimeout(timeoutHandle);
    const current = inFlightByTab.get(tabId);
    if (current?.url === url) {
      inFlightByTab.delete(tabId);
    }
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const candidateUrl = typeof changeInfo.url === "string" ? changeInfo.url : tab.url;
  if (!candidateUrl) return;

  // Trigger as early as possible on URL change, and keep complete as a fallback.
  if (changeInfo.url || changeInfo.status === "complete") {
    processUrl(tabId, candidateUrl);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "allowOnce" || typeof message.url !== "string") {
    return;
  }

  const senderTabId = Number.isInteger(sender.tab?.id) ? sender.tab.id : null;
  const messageTabId = Number.isInteger(message.tabId) ? message.tabId : null;
  const directTabId = messageTabId ?? senderTabId;

  const resolveTabId = async () => {
    if (Number.isInteger(directTabId)) return directTabId;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    return Number.isInteger(activeTab?.id) ? activeTab.id : null;
  };

  resolveTabId()
    .then(tabId => {
      if (!Number.isInteger(tabId)) {
        sendResponse({ ok: false, error: "tab_id_unavailable" });
        return;
      }
      allowUrlOnce(tabId, message.url)
        .then(() => sendResponse({ ok: true }))
        .catch(err => sendResponse({ ok: false, error: String(err) }));
    })
    .catch(err => sendResponse({ ok: false, error: String(err) }));

  return true;
});