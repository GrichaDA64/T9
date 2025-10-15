document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");

  let timeLeft = parseInt(input.value);
  let interval = null;
  let state = "ready"; // ready, running, paused

  // Sonnerie
  const sonnerie = new Audio("dring.mp3");
  sonnerie.load();

  // Icône play
  const playIcon = "▶"; // triangle vert

  button.textContent = timeLeft;

  function startTimer() {
    if (interval) clearInterval(interval);

    sonnerie.pause();
    sonnerie.currentTime = 0;

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
        state = "paused";
        button.textContent = playIcon;

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
