chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (changeInfo.status === "complete" && tab.url) {

    fetch("http://localhost:8000/predict", {
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
      if (data.prediction === 1) {
        alert("⚠️ Phishing Website Detected!");
      }
    });

  }
});