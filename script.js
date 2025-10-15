document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");

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
  tic.playbackRate = 6; // vitesse x6
  tic.volume = 1.0;      // volume max

  // Affiche la durée initiale
  button.textContent = timeLeft;
  button.style.fontSize = "6rem"; // texte initial gros

  function startTimer() {
    if (interval) clearInterval(interval);

    // Joue le tic à chaque reset (décalé de 0.1s)
    tic.currentTime = 0.1;
    tic.play().catch(err => console.log("Erreur tic :", err));

    // Effet rebond rapide
    button.style.transform = "scale(1.1)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 100);

    // Vibration si
