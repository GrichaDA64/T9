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

function startTimer() {
  if (interval) clearInterval(interval);

  tic.currentTime = 0;

  sonnerie.pause();
  sonnerie.currentTime = 0;

  const duration = parseInt(input.value);
  cycleDuration = isNaN(duration) || duration <= 0 ? 20 : duration;

  state = "running";
  button.style.fontSize = "6rem";

  startTime = performance.now();
  lastDisplayedSecond = cycleDuration;

  button.textContent = cycleDuration;

  interval = setInterval(() => {
    const elapsed = Math.floor((performance.now() - startTime) / 1000);
    const currentTime = cycleDuration - elapsed;

    if (currentTime !== lastDisplayedSecond) {
      lastDisplayedSecond = currentTime;
      button.textContent = currentTime;

      if (currentTime <= 5 && currentTime > 0 && !ticPlayed) {
        ticPlayed = true;
        tic.currentTime = 0;
        tic.play().catch(() => {});
      }

      // FIN DU CYCLE
      if (currentTime <= 0) {
        sonnerie.currentTime = 0;
        sonnerie.play().catch(() => {});

        cycleDuration = 10;
        startTime = performance.now();
        lastDisplayedSecond = cycleDuration;
        button.textContent = cycleDuration;
      }
    }
  }, 50); // haute fréquence, calcul léger
}


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
