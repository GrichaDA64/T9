document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");

  let timeLeft = parseInt(input.value);
  let interval = null;
  let state = "ready"; // ready, running, paused

  // Sonnerie longue à zéro
  const sonnerie = new Audio("dring.mp3");
  sonnerie.load();

  // Tic sonore à chaque reset
  const tic = new Audio("tic.mp3");
  tic.load();
  tic.playbackRate = 4; // vitesse x4

  // Icône play
  const playIcon = "▶"; // triangle vert

  // Affiche la durée initiale
  button.textContent = timeLeft;

  function startTimer() {
    if (interval) clearInterval(interval);

    // Joue le tic à chaque reset
    tic.currentTime = 0;
    tic.play().catch(err => console.log("Erreur tic :", err));

    // Reset sonnerie
    sonnerie.pause();
    sonnerie.currentTime = 0;

    // Récupère durée
    timeLeft = parseInt(input.value);
    if (isNaN(timeLeft) || timeLeft <= 0) timeLeft = 15;

    button.textContent = timeLeft;
    state = "running";

    interval = setInterval(() => {
      timeLeft--;
      button.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(interval);
        interval = null;
        state = "paused"; // pause
        button.textContent = playIcon;

        // Joue le son pendant 3 secondes
        sonnerie.currentTime = 0;
        sonnerie.play().catch(err => console.log("Erreur son :", err));
        setTimeout(() => {
          sonnerie.pause();
          sonnerie.currentTime = 0;
        }, 3000);
      }
    }, 1000);
  }

  function handleButtonClick() {
    if (state === "ready" || state === "paused" || state === "running") {
      startTimer();
    }
  }

  button.addEventListener("click", handleButtonClick);
});
