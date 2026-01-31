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

  let rafId = null;
let nextRingTime = 0;
let cycleDuration = 0;
let lastSecondDisplayed = null;
let ringing = false; // 🔒 verrou anti-overlap

function startTimer() {
  cancelAnimationFrame(rafId);

  tic.currentTime = 0;
  tic.play().catch(() => {});

  sonnerie.pause();
  sonnerie.currentTime = 0;
  ringing = false;

  const initial = parseInt(input.value);
  cycleDuration = isNaN(initial) || initial <= 0 ? 15 : initial;

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

  if (remainingSec !== lastSecondDisplayed) {
    lastSecondDisplayed = remainingSec;
    button.textContent = remainingSec;

    if (remainingSec <= 5 && remainingSec > 0) {
      tic.currentTime = 0;
      tic.play().catch(() => {});
    }
  }

  if (remainingMs <= 0 && !ringing) {
    ringing = true;

    sonnerie.currentTime = 0;
    sonnerie.play()
      .catch(() => {})
      .finally(() => {
        setTimeout(() => ringing = false, 3000);
      });

    nextRingTime += 4700;
    lastSecondDisplayed = null;
  }

  rafId = requestAnimationFrame(loop);
}



function handleButtonClick() {
   if (state === "ready" || state === "paused" || state === "running") {
     startTimer();
   }
}

stopButton.addEventListener("click", () => {
  cancelAnimationFrame(rafId);
  rafId = null;

  sonnerie.pause();
  sonnerie.currentTime = 0;
  ringing = false;

  state = "ready";
  button.textContent = input.value || 15;
});

});
