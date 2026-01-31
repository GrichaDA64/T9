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

// Tic de fin
const tic = new Audio("tic.mp3");
tic.load();
tic.volume = 1.0;      // volume max

// Tic sonore à chaque reset
const start = new Audio("reset.mp3");
start.load();
start.volume = 1.0;      // volume max

// Affiche la durée initiale
button.textContent = timeLeft;
button.style.fontSize = "6rem"; // texte initial gros
    
let rafId = null;
let nextRingTime = 0;
let cycleDuration = 0;
let lastSecondDisplayed = null;
let ringing = false;
let ticPlayed = false;

function startTimer() {
  cancelAnimationFrame(rafId);

  start.currentTime = 0;
  start.play().catch(() => {});
  
  tic.pause();
  tic.currentTime = 0;
  ticPlayed = false;

  sonnerie.pause();
  sonnerie.currentTime = 0;
  ringing = false;

  const initial = parseInt(input.value);
  cycleDuration = isNaN(initial) || initial <= 0 ? 20 : initial;

  state = "running";
  button.style.fontSize = "6rem";

  const now = performance.now();
  nextRingTime = now + cycleDuration * 1000;
  lastSecondDisplayed = null;

  loop();
}

function loop() {
  const now = performance.now();
  const remainingMs = nextRingTime - now;
  const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

  // Mise à jour affichage
  if (remainingSec !== lastSecondDisplayed) {
    lastSecondDisplayed = remainingSec;
    button.textContent = remainingSec;

    // Tic sur les 5 dernières secondes
    if (remainingSec <= 5 && remainingSec > 0 && !ticPlayed) {
      ticPlayed = true;
      tic.currentTime = 0;
      tic.play().catch(() => {});
    }
  }

  // 🔔 Sonnerie sans overlap
  if (remainingMs <= 0 && !ringing) {
    ringing = true;
    tic.pause();
    tic.currentTime = 0;
    ticPlayed = false;

    sonnerie.currentTime = 0;
    sonnerie.play()
      .catch(() => {})
      .finally(() => {
        // Sécurité : déverrouillage même si play() échoue
        setTimeout(() => {
          ringing = false;
          sonnerie.pause();
          sonnerie.currentTime = 0;
        }, 3000);
      });

    nextRingTime += 10000;
    lastSecondDisplayed = null;
  }

  rafId = requestAnimationFrame(loop);
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
    tic.pause();
    tic.currentTime = 0;
    sonnerie.pause();
    sonnerie.currentTime = 0;
    button.textContent = timeLeft;
    input.value = timeLeft;
  });

});
