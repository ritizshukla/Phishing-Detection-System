let lastCheckedUrl = "";
const safeBypassByTab = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (changeInfo.status !== "complete" || !tab.url) return;

  const url = tab.url;

  // Ignore internal + extension pages
  if (
    url.startsWith("chrome://") ||
    url.startsWith("edge://") ||
    url.includes("warning.html") ||
    url.includes("safe.html")
  ) return;

  // If we just sent user from safe page to this URL, allow it once without re-checking.
  const bypassUrl = safeBypassByTab.get(tabId);
  if (bypassUrl && bypassUrl === url) {
    safeBypassByTab.delete(tabId);
    return;
  }

  // Prevent duplicate calls
  if (url === lastCheckedUrl) return;
  lastCheckedUrl = url;

  fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  })
  .then(res => res.json())
  .then(data => {

    if (data.prediction === 1) {
      const warningPage = chrome.runtime.getURL(
        "warning/warning.html?url=" + encodeURIComponent(url)
      );

      chrome.tabs.update(tabId, { url: warningPage });
      return;
    }

    const confidence = Number.isFinite(data.confidence) ? data.confidence : 0;
    const safeScore = Math.max(0, Math.min(100, Math.round((1 - confidence) * 100)));
    const seconds = 3;

    safeBypassByTab.set(tabId, url);

    const safePage = chrome.runtime.getURL(
      "safe/safe.html?url=" + encodeURIComponent(url) +
      "&safeScore=" + encodeURIComponent(String(safeScore)) +
      "&seconds=" + encodeURIComponent(String(seconds))
    );

    chrome.tabs.update(tabId, { url: safePage });
  })
  .catch(err => console.error("API Error:", err));
});