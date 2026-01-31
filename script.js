document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");
  const stopButton = document.getElementById("stopButton");

  let interval = null;
  let state = "ready"; // ready, running, paused

  const sonnerie = new Audio("dring.mp3");
  sonnerie.load();
  sonnerie.volume = 0.5;

  const tic = new Audio("tic.mp3");
  tic.load();
  tic.volume = 1.0;

  const start = new Audio("reset.mp3");
  start.load();
  start.volume = 1.0;

  button.style.fontSize = "6rem";

  let rafId = null;
  let nextRingTime = 0;
  let cycleDuration = 0;
  let lastSecondDisplayed = null;
  let ringing = false;
  let ticPlayed = false;

  function startTimer() {
    cancelAnimationFrame(rafId);

    // Jouer le son de reset
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
    button.textContent = cycleDuration;
    lastSecondDisplayed = null;

    nextRingTime = performance.now() + cycleDuration * 1000;

    loop();
  }

  function loop() {
    if (state !== "running") return; // stop si état changé

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

    // Sonnerie sans overlap
    if (remainingMs <= 0 && !ringing) {
      ringing = true;
      tic.pause();
      tic.currentTime = 0;
      ticPlayed = false;

      sonnerie.currentTime = 0;
      sonnerie.play()
        .catch(() => {})
        .finally(() => {
          // Déverrouillage même si play échoue
          setTimeout(() => {
            ringing = false;
            sonnerie.pause();
            sonnerie.currentTime = 0;
          }, 3000);
        });

      nextRingTime = now + 10000; // reset cycle à 10s
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
    // Arrêt du timer
    state = "ready";
    cancelAnimationFrame(rafId);

    // Arrêt immédiat des sons
    tic.pause();
    tic.currentTime = 0;
    sonnerie.pause();
    sonnerie.currentTime = 0;

    // Réinitialisation des variables
    lastSecondDisplayed = null;
    ticPlayed = false;
    ringing = false;

    const initial = parseInt(input.value) || 20;
    cycleDuration = initial;
    button.textContent = cycleDuration;
  });

  // Affichage initial
  const initial = parseInt(input.value) || 20;
  button.textContent = initial;
});
