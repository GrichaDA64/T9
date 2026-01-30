document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");
  const stopButton = document.getElementById("stopButton");


let timeLeft = parseInt(input.value);
let interval = null;
let state = "ready"; // ready, running, paused

// Sonnerie longue à zéro
const sonnerie = new Audio("dring.mp3");
sonnerie.load();
sonnerie.volume = 0.5; // volume diminué

// Tic sonore à chaque reset
const tic = new Audio("tic.mp3");
tic.load();
// tic.playbackRate = 6; // vitesse x6
tic.volume = 1.0;      // volume max

// Affiche la durée initiale
button.textContent = timeLeft;
button.style.fontSize = "6rem"; // texte initial gros

let startTime = 0;
let lastDisplayedSecond = null;
let cycleDuration = 0;

function startTimer() {
  if (interval) clearInterval(interval);

  tic.currentTime = 0;
  tic.play().catch(() => {});

  sonnerie.pause();
  sonnerie.currentTime = 0;

  const duration = parseInt(input.value);
  cycleDuration = isNaN(duration) || duration <= 0 ? 15 : duration;

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

      // Tic les 5 dernières secondes
      if (currentTime <= 5 && currentTime > 0) {
        tic.currentTime = 0;
        tic.play().catch(() => {});
      }

      // FIN DU CYCLE
      if (currentTime === 0) {
        // Sonnerie
        sonnerie.currentTime = 0;
        sonnerie.play().catch(() => {});

        // 🔁 Redémarre immédiatement un cycle de 5 secondes
        cycleDuration = 5;
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
    button.textContent = "15";
    input.value = 15;
  });

});
