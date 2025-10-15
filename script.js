const button = document.getElementById("timerButton");
const input = document.getElementById("durationInput");
const sonCheckbox = document.getElementById("sonEnabled");
let timeLeft = parseInt(input.value);
let interval = null;

// Prépare le son
const sonnerie = new Audio("dring.mp3");
sonnerie.load();

button.addEventListener("click", () => {
  if (interval) {
    clearInterval(interval);
  }

  // Stoppe et réinitialise le son
  sonnerie.pause();
  sonnerie.currentTime = 0;

  // Récupère la durée choisie
  timeLeft = parseInt(input.value);
  if (isNaN(timeLeft) || timeLeft <= 0) timeLeft = 30;

  button.textContent = timeLeft;

  interval = setInterval(() => {
    timeLeft--;
    button.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      interval = null;

      // Joue la sonnerie si cochée
      if (sonCheckbox.checked) {
        sonnerie.play().catch(err => console.log("Erreur son :", err));
      }

      // Réinitialise l'affichage
      setTimeout(() => {
        button.textContent = input.value;
      }, 2000);
    }
  }, 1000);
});
