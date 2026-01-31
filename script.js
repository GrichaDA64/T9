document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");
  const stopButton = document.getElementById("stopButton");

  let interval = null;
  let state = "ready"; // "ready", "running", "paused"

  let cycleDuration = 0;
  let cycleEndTime = 0;
  let lastSecond = null;

  let audioCtx;
  let buffers = {};
  let unlocked = false;
  let activeSources = [];

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
    activeSources.push(src);
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

  function timerTick() {
    if (state === "ready") return;

    const now = performance.now();
    let remainingMs = cycleEndTime - now;
    let remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

    if (state === "paused") {
      // Affiche 0 pendant la pause
      button.textContent = 0;
      return;
    }

    if (remainingSec !== lastSecond) {
      button.textContent = remainingSec;

      // Tic
      if (lastSecond === 6 && remainingSec === 5) {
        play("tic", 1);
      }

      // Fin de cycle
      if (lastSecond === 1 && remainingSec === 0) {
        play("dring", 0.5);
        state = "paused"; // pause de 2s
        lastSecond = 0;

        // Nouvelle date de fin pour le prochain cycle
        setTimeout(() => {
          cycleDuration = 10;
          cycleEndTime = performance.now() + cycleDuration * 1000;
          lastSecond = cycleDuration;
          state = "running";
        }, 1000);

        return;
      }

      lastSecond = remainingSec;
    }
  }

  button.addEventListener("click", async () => {
    stopAllSounds();
    await unlockAudio();
    startTimer();
  });

  stopButton.addEventListener("click", () => {
    state = "ready";
    clearInterval(interval);
    const initial = parseInt(input.value) || 20;
    button.textContent = initial;
    lastSecond = null;
    stopAllSounds();
  });

  button.style.fontSize = "6rem";
  button.textContent = parseInt(input.value) || 20;
});
