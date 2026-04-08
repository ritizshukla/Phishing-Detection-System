chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (changeInfo.status === "complete" && tab.url) {

    // Ignore chrome internal pages
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
      return;
    }

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: tab.url
      })
    })
    .then(res => res.json())
    .then(data => {

      console.log("Prediction:", data);

      if (data.prediction === 1) {
        alert("⚠️ Phishing Website Detected!\n\nURL: " + tab.url);
      }

    })
    .catch(err => console.error("API Error:", err));

  }
});