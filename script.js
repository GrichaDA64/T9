document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");
    const stopButton = document.getElementById("stopButton");


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
 // tic.playbackRate = 6; // vitesse x6
  tic.volume = 1.0;      // volume max

  // Affiche la durée initiale
  button.textContent = timeLeft;
  button.style.fontSize = "6rem"; // texte initial gros

  function startTimer() {
    if (interval) clearInterval(interval);

    // Joue le tic à chaque reset
    tic.currentTime = 0;
    tic.play().catch(err => console.log("Erreur tic :", err));

    // Effet rebond rapide
    button.style.transform = "scale(1.1)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 100);

    // Vibration si supportée
  //  if (navigator.vibrate) {
    //  navigator.vibrate(100); // 100ms
    //}

    // Reset sonnerie
    sonnerie.pause();
    sonnerie.currentTime = 0;

    // Récupère durée
    timeLeft = parseInt(input.value);
    if (isNaN(timeLeft) || timeLeft <= 0) timeLeft = 15;

    button.textContent = timeLeft;
    button.style.fontSize = "6rem"; // texte gros pendant le chrono
    state = "running";

    /*interval = setInterval(() => {
      timeLeft--;
      button.textContent = timeLeft;
      // Tic chaque seconde à partir de 5 secondes avant la fin
      if (timeLeft <= 5 && timeLeft > 0) {
        tic.currentTime = 0;
        tic.play().catch(err => console.log("Erreur tic :", err));
      }
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        interval = null;
        state = "paused"; // pause
        button.textContent = "0"; // plus de triangle
        button.style.fontSize = "6rem"; // reste gros

        // Joue le son pendant 3 secondes
        sonnerie.currentTime = 0;
        sonnerie.play().catch(err => console.log("Erreur son :", err));
        setTimeout(() => {
          sonnerie.pause();
          sonnerie.currentTime = 0;
        }, 3000);
      }
    }, 1000);*/
      
    interval = setInterval(() => {
      timeLeft--;
      button.textContent = timeLeft;
    
      // Tic chaque seconde à partir de 5 secondes avant la fin
      if (timeLeft <= 5 && timeLeft > 0) {
        tic.currentTime = 0;
        tic.play().catch(err => console.log("Erreur tic :", err));
      }
    
      // Passage à zéro
      if (timeLeft === 0) {
        state = "paused";
    
        sonnerie.currentTime = 0;
        sonnerie.play().catch(err => console.log("Erreur son :", err));
      }
    
      // Temps négatif : sonnerie toutes les 5 secondes
      if (timeLeft < 0 && Math.abs(timeLeft) % 5 === 0) {
        sonnerie.currentTime = 0;
        sonnerie.play().catch(err => console.log("Erreur son :", err));
      }
    
    }, 1000);

  }

  function handleButtonClick() {
    if (state === "ready" || state === "paused" || state === "running") {
      startTimer();
    }
  }

  button.addEventListener("click", handleButtonClick);
    stopButton.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    state = "ready";
    sonnerie.pause();
    sonnerie.currentTime = 0;
    button.textContent = "15";
    input.value = 15;
  });

});
