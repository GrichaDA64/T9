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
// tic.playbackRate = 6; // vitesse x6
tic.volume = 1.0;      // volume max

// Tic sonore à chaque reset
const reset = new Audio("reset.mp3");
reset.load();
// tic.playbackRate = 6; // vitesse x6
reset.volume = 1.0;      // volume max

// Affiche la durée initiale
button.textContent = timeLeft;
button.style.fontSize = "6rem"; // texte initial gros
    
let rafId = null;
let nextRingTime = 0;
let cycleDuration = 0;
let lastSecondDisplayed = null;
let ringing = false; // 🔒 verrou anti-overlap

function startTimer() {
  cancelAnimationFrame(rafId);

  reset.currentTime = 0;
  reset.play().catch(() => {});

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
    if (remainingSec <= 5 && remainingSec > 0) {
      tic.currentTime = 0;
      tic.play().catch(() => {});
    }
  }

  // 🔔 Sonnerie sans overlap
  if (remainingMs <= 0 && !ringing) {
    ringing = true;
    tic.pause();
    tic.currentTime = 0;

    sonnerie.currentTime = 0;
    sonnerie.play()
      .catch(() => {})
      .finally(() => {
        // Sécurité : déverrouillage même si play() échoue
        setTimeout(() => ringing = false, 3000);
      });

    // Prochaine sonnerie exactement +5s
    nextRingTime += 5000;
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
    sonnerie.pause();
    sonnerie.currentTime = 0;
    button.textContent = timeLeft;
    input.value = timeLeft;
  });

});
