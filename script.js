const button = document.getElementById("timerButton");
const input = document.getElementById("durationInput");
const pauseButton = document.getElementById("pauseButton");

let timeLeft = parseInt(input.value);
let interval = null;

// Sonnerie
const sonnerie = new Audio("dring.mp3");
sonnerie.load();

// Fonction pour démarrer le timer
function startTimer() {
  if (interval) {
    clearInterval(interval);
  }

  // Stop et reset son
  sonnerie.pause();
  sonnerie.currentTime = 0;

  // Récupère durée
  timeLeft = parseInt(input.value);
  if (isNaN(timeLeft) || timeLeft <= 0) timeLeft = 30;
  button.textContent = timeLeft;

  interval = setInterval(() => {
    timeLeft--;
    button.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      interval = null;
      sonnerie.play().catch(err => console.log("Erreur son :", err));
      setTimeout(() => {
        button.textContent = input.value;
      }, 2000);
    }
  }, 1000);
}

// Fonction pour pause
function pauseTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  // Stop son si il joue
  sonnerie.pause();
  sonnerie.currentTime = 0;
}

// Événements
button.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
