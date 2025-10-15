const button = document.getElementById("timerButton");
let timeLeft = 30;
let interval = null;

// Prépare le son
const sonnerie = new Audio("dring.mp3");

button.addEventListener("click", () => {
  // Si un compte à rebours est déjà en cours, on le réinitialise
  if (interval) {
    clearInterval(interval);
  }

  // Réinitialise le son au cas où
  sonnerie.pause();
  sonnerie.currentTime = 0;

  // Réinitialise le minuteur
  timeLeft = 30;
  button.textContent = timeLeft;

  interval = setInterval(() => {
    timeLeft--;
    button.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      interval = null;

      // Joue la sonnerie
      sonnerie.play().catch((error) => {
        console.log("Impossible de lire le son :", error);
      });

      // Réinitialise l'affichage après la sonnerie
      setTimeout(() => {
        button.textContent = "30";
      }, 2000);
    }
  }, 1000);
});

