document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const url = params.get("url");

  const meterFill = document.getElementById("meterFill");
  const confidenceText = document.getElementById("confidenceText");
  const explanationList = document.getElementById("explanation");

  // API call
  try {
    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    const confidence = Math.round(data.confidence * 100);
    meterFill.style.width = confidence + "%";
    confidenceText.innerText = "Risk Level: " + confidence + "%";

    explanationList.innerHTML = "";
    data.explanation.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      explanationList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }

  document.getElementById("goBack").onclick = () => history.back();
  document.getElementById("continue").onclick = () => {
    window.location.href = url;
  };

  // 🔥 PARTICLE SYSTEM
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();
});