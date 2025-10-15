const button = document.getElementById("timerButton");
const input = document.getElementById("durationInput");

let timeLeft = parseInt(input.value);
let interval = null;
let state = "ready"; // ready, running, paused

// Sonnerie
const sonnerie = new Audio("dring.mp3");
sonnerie.load();

function startTimer() {
  if (interval) clearInterval(interval);

  // Reset son
  sonnerie.pause();
  sonnerie.currentTime = 0;

  // Récupère durée
  timeLeft = parseInt(input.value);
  if (isNaN(timeLeft) || timeLeft <= 0) timeLeft = 30;

  button.textContent = timeLeft;
  state = "running";

  interval = setInterval(() => {
    timeLeft--;
    button.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      interval = null;
      state = "paused"; // on met en pause
      button.textContent = "0";

      // Joue le son pendant 3 secondes seulement
      sonnerie.currentTime = 0;
      sonnerie.play().catch(err => console.log("Erreur son :", err));
      setTimeout(() => {
        sonnerie.pause();
      }, 3000);
    }
  }, 1000);
}

function handleButtonClick() {
  if (state === "ready" || state === "paused" || state === "running") {
    startTimer();
  }
}

// Événement
button.addEventListener("click", handleButtonClick);
