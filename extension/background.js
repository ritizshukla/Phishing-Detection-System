chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (changeInfo.status === "complete" && tab.url) {

    // ❌ Ignore internal + warning page
    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("edge://") ||
      tab.url.includes("warning.html")
    ) {
      return;
    }

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: tab.url })
    })
    .then(res => res.json())
    .then(data => {

      if (data.prediction === 1) {

        const warningPage = chrome.runtime.getURL(
          "warning/warning.html?url=" + encodeURIComponent(tab.url)
        );

        chrome.tabs.update(tabId, { url: warningPage });
      }

    })
    .catch(err => console.error("API Error:", err));

  }
});