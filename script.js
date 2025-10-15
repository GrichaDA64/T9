const button = document.getElementById("timerButton");
let timeLeft = 30;
let interval = null;

button.addEventListener("click", () => {
  // Si un compte à rebours est déjà en cours, on le réinitialise
  if (interval) {
    clearInterval(interval);
  }

  timeLeft = 30;
  button.textContent = timeLeft;

  interval = setInterval(() => {
    timeLeft--;
    button.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      interval = null;
      button.textContent = "30";
    }
  }, 1000);
});
