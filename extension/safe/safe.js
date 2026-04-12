document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const targetUrl = params.get("url") || "https://www.google.com";

  const safeScoreValue = Number.parseInt(params.get("safeScore") || "0", 10);
  const safeScore = Number.isFinite(safeScoreValue)
    ? Math.max(0, Math.min(100, safeScoreValue))
    : 0;

  const secondsValue = Number.parseInt(params.get("seconds") || "3", 10);
  let seconds = Number.isFinite(secondsValue)
    ? Math.max(1, Math.min(10, secondsValue))
    : 3;

  const safeScoreEl = document.getElementById("safeScore");
  const countdownEl = document.getElementById("countdownText");
  const openBtn = document.getElementById("openSite");

  safeScoreEl.textContent = `${safeScore}%`;

  const navigateToTarget = () => {
    window.location.replace(targetUrl);
  };

  const updateCountdown = () => {
    countdownEl.textContent = `Opening in ${seconds}s`;
  };

  updateCountdown();

  const timer = setInterval(() => {
    seconds -= 1;
    if (seconds <= 0) {
      clearInterval(timer);
      navigateToTarget();
      return;
    }
    updateCountdown();
  }, 1000);

  openBtn.addEventListener("click", () => {
    clearInterval(timer);
    navigateToTarget();
  });
});
