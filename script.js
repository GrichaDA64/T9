document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");
    const stopButton = document.getElementById("stopButton");


  let timeLeft = parseInt(input.value);
  let interval = null;
  let state = "ready"; // ready, running, paused

  const sonnerie = new Audio("dring.mp3");
  sonnerie.load();
  sonnerie.volume = 0.5; // volume diminué

  const tic = new Audio("tic.mp3");
  tic.load();
  tic.volume = 1.0;      // volume max

  // Affiche la durée initiale
  button.textContent = timeLeft;
  button.style.fontSize = "6rem"; // texte initial gros

  let startTime = 0;
  let lastDisplayedSecond = null;
  let cycleDuration = 0;
  let ticPlayed = false;

interval = setInterval(() => {
  const elapsed = Math.floor((performance.now() - startTime) / 1000);
  const currentTime = cycleDuration - elapsed;

  // 🔢 Affichage
  if (currentTime !== lastDisplayedSecond && currentTime >= 0) {
    lastDisplayedSecond = currentTime;
    button.textContent = currentTime;

    // ▶️ Tic UNE SEULE FOIS au passage 6 → 5
    if (currentTime === 5 && !ticPlayed) {
      ticPlayed = true;
      tic.currentTime = 0;
      tic.play().catch(() => {});
    }
  }

  // 🔔 Fin de cycle (événement unique)
  if (currentTime <= 0 && lastDisplayedSecond !== cycleDuration) {
    sonnerie.currentTime = 0;
    sonnerie.play().catch(() => {});

    // 🔁 Nouveau cycle à 10 secondes
    cycleDuration = 10;
    startTime = performance.now();
    lastDisplayedSecond = cycleDuration;
    button.textContent = cycleDuration;
    ticPlayed = false;
  }

}, 50);

  function handleButtonClick() {
    if (state === "ready" || state === "paused" || state === "running") {
      startTimer();
    }
  }

  button.addEventListener("click", handleButtonClick);
    stopButton.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    state = "ready";
    sonnerie.pause();
    sonnerie.currentTime = 0;
    button.textContent = "20";
    input.value = 20;
  });

});
