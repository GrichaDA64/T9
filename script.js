document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");
  const stopButton = document.getElementById("stopButton");

  let state = "ready";
  let rafId = null;

  /* ============================
     🎵 AUDIO LOW LATENCY
     ============================ */
  let audioCtx = null;
  let buffers = {};
  let audioUnlocked = false;

  async function loadSound(name, url) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    buffers[name] = await audioCtx.decodeAudioData(arrayBuffer);
  }

  function playSound(name, volume = 1.0) {
    if (!audioUnlocked || !buffers[name]) return;

    const source = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();

    gain.gain.value = volume;
    source.buffer = buffers[name];

    source.connect(gain);
    gain.connect(audioCtx.destination);

    source.start(0);
  }

  async function unlockAudio() {
    if (audioUnlocked) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    await audioCtx.resume();

    await Promise.all([
      loadSound("start", "reset.mp3"),
      loadSound("tic", "tic.mp3"),
      loadSound("dring", "dring.mp3")
    ]);

    audioUnlocked = true;
  }

  /* ============================
     ⏱ TIMER LOGIC
     ============================ */
  let nextRingTime = 0;
  let cycleDuration = 0;
  let lastSecondDisplayed = null;
  let ringing = false;
  let ticPlayed = false;

  button.style.fontSize = "6rem";

  function startTimer() {
    cancelAnimationFrame(rafId);

    playSound("start", 1.0);

    ticPlayed = false;
    ringing = false;

    const initial = parseInt(input.value);
    cycleDuration = isNaN(initial) || initial <= 0 ? 20 : initial;

    state = "running";
    button.textContent = cycleDuration;
    lastSecondDisplayed = null;

    nextRingTime = performance.now() + cycleDuration * 1000;
    loop();
  }

  function loop() {
    if (state !== "running") return;

    const now = performance.now();
    const remainingMs = nextRingTime - now;
    const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

    if (remainingSec !== lastSecondDisplayed) {
      lastSecondDisplayed = remainingSec;
      button.textContent = remainingSec;

      if (remainingSec <= 5 && remainingSec > 0 && !ticPlayed) {
        ticPlayed = true;
        playSound("tic", 1.0);
      }
    }

    if (remainingMs <= 0 && !ringing) {
      ringing = true;
      ticPlayed = false;

      playSound("dring", 0.5);

      nextRingTime = now + 10000; // nouveau cycle 10s
      lastSecondDisplayed = null;

      setTimeout(() => {
        ringing = false;
      }, 3000);
    }

    rafId = requestAnimationFrame(loop);
  }

  /* ============================
     🖱 EVENTS
     ============================ */
  button.addEventListener("click", async () => {
    await unlockAudio();
    startTimer();
  });

  stopButton.addEventListener("click", () => {
    state = "ready";
    cancelAnimationFrame(rafId);

    lastSecondDisplayed = null;
    ticPlayed = false;
    ringing = false;

    const initial = parseInt(input.value) || 20;
    button.textContent = initial;
  });

  /* ============================
     📺 INITIAL DISPLAY
     ============================ */
  const initial = parseInt(input.value) || 20;
  button.textContent = initial;
});
