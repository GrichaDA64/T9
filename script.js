const button = document.getElementById("timerButton");
const input = document.getElementById("durationInput");

let timeLeft = parseInt(input.value);
let interval = null;
let state = "ready"; // ready, running, finished

// Sonnerie
const sonnerie = new Audio("dring.mp3");
sonnerie.load();
let sonCount = 0;

function startTimer() {
  if (interval) {
    clearInterval(interval);
  }

  // Reset son
  sonnerie.pause();
  sonnerie.currentTime = 0;
  sonCount = 0;

  // Récupère la durée
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
      state = "finished";
      button.textContent = "||"; // bouton pause

      // Joue le son 2 fois
      function playSon() {
        if (sonCount < 2) {
          sonnerie.currentTime = 0;
          sonnerie.play().catch(err => console.log("Erreur son :", err));
          sonCount++;
          setTimeout(playSon, 1000); // délai 1s entre les sons
        }
      }
      playSon();
    }
  }, 1000);
}

function handleButtonClick() {
  if (state === "ready" || state === "running") {
    startTimer();
  } else if (state === "finished") {
    // bouton pause -> play
    startTimer();
  }
}

// Événement
button.addEventListener("click", handleButtonClick);
