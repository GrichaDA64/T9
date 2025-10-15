const button = document.getElementById("timerButton");
const input = document.getElementById("durationInput");
let timeLeft = parseInt(input.value);
let interval = null;

// Crée l'objet Audio au début et précharge le son
const sonnerie = new Audio("dring.mp3");
sonnerie.load(); // précharge le son pour qu'il soit prêt à jouer

button.addEventListener("click", () => {
  // Si un compte à rebours est déjà en cours, on le réinitialise
  if (interval) {
    clearInterval(interval);
  }

  // Stoppe et réinitialise la sonnerie
  sonnerie.pause();
  sonnerie.currentTime = 0;

  // Récupère la durée choisie
  timeLeft = parseInt(input.value);
  if (isNaN(timeLeft) || timeLeft <= 0) timeLeft = 30;

  button.textContent = timeLeft;

  // Démarre le compte à rebours
  interval = setInterval(() => {
    timeLeft--;
    button.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      interval = null;

      // Joue la sonnerie (doit être autorisée car l'utilisateur a cliqué)
      sonnerie.play().catch((err) => console.log("Erreur son :", err));

      // Réinitialise l'affichage
      setTimeout(() => {
        button.textContent = input.value;
      }, 2000);
    }
  }, 1000);
});
