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

  // Texte pour le bouton à zéro
  const restartText = "Redémarrer";

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
      button.textCon
