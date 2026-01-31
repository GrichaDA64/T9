document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");
  const stopButton = document.getElementById("stopButton");

  let interval = null;
  let state = "ready";

  let cycleDuration = 0;
  let cycleEndTime = 0;
  let lastSecond = null;

  /* =========================
     🔊 AUDIO LOW LATENCY
     ========================= */
  let audioCtx;
  let buffers = {};
  let unlocked = false;
  let activeSources = []; // liste des sources audio actives

  async function unlockAudio() {
    if (unlocked) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    await audioCtx.resume();

    await Promise.all([
      loadSound("start", "reset.mp3"),
      loadSound("tic", "tic.mp3"),
      loadSound("dring", "dring.mp3")
    ]);

    unlocked = true;
  }

  async function loadSound(name, url) {
    const res = await fetch(url);
    const data = await res.arrayBuffer();
    buffers[name] = await audioCtx.decodeAudioData(data);
  }

  function play(name, volume = 1) {
    if (!buffers[name]) return;

    const src = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();

    src.buffer = buffers[name];
    gain.gain.value = volume;

    src.connect(gain);
    gain.connect(audioCtx.destination);

    src.start();

    // Ajouter la source à la liste active
    activeSources.push(src);

    // Retirer la source quand le son se termine
    src.onended = () => {
      const index = activeSources.indexOf(src);
      if (index > -1) activeSources.splice(index, 1);
    };
  }

  function stopAllSounds() {
    activeSources.forEach(src => {
      try { src.stop(); } catch (e) {}
    });
    activeSources = [];
  }

  /* =========================
     ⏱ TIMER PRÉCIS ET SAIN
     ========================= */
  function timerTick() {
    if (state !== "running") return;

    const now = performance.now();
    const remainingMs = cycleEndTime - now;
    const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

    if (remainingSec !== lastSecond) {
      button.textContent = remainingSec;

      // 🔹 TIC : transition 6 → 5
      if (lastSecond === 6 && remainingSec === 5) {
        play("tic", 1);
      }

      // 🔹 FIN DE CYCLE
      if (lastSecond === 1 && remainingSec === 0) {
        button.textContent = 0;
        play("dring", 0.5);

        // 🔹 arrêter temporairement le timer
        clearInterval(interval);
        state = "paused";

        // 🔹 attendre 2 secondes avant de relancer un cycle de 10 s
        setTimeout(() => {
          cycleDuration = 10;
          cycleEndTime = performance.now() + cycleDuration * 1000;
          lastSecond = cycleDuration;
          state = "running";

          // relancer l'interval
          interval = setInterval(timerTick, 100);
        }, 2000);

        return;
      }

      lastSecond = remainingSec;
    }
  }

  function startTimer() {
    clearInterval(interval);

    const initial = parseInt(input.value);
    cycleDuration = isNaN(initial) || initial <= 0 ? 20 : initial;

    cycleEndTime = performance.now() + cycleDuration * 1000;
    lastSecond = null;
    state = "running";

    play("start", 1);

    interval = setInterval(timerTick, 100);
  }

  /* =========================
     🖱 EVENTS
     ========================= */
  button.addEventListener("click", async () => {
    stopAllSounds(); // arrêter les sons si l'utilisateur clique
    await unlockAudio();
    startTimer();
  });

  stopButton.addEventListener("click", () => {
    state = "ready";
    clearInterval(interval);

    const initial = parseInt(input.value) || 20;
    button.textContent = initial;
    lastSecond = null;

    stopAllSounds(); // arrêter les sons si l'utilisateur clique
  });

  button.style.fontSize = "6rem";
  button.textContent = parseInt(input.value) || 20;
});
