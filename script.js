document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");
  const stopButton = document.getElementById("stopButton");

  let state = "ready";
  let interval = null;
  let remaining = 0;

  /* =========================
     🔊 AUDIO LOW LATENCY
     ========================= */
  let audioCtx;
  let buffers = {};
  let unlocked = false;

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
  }

  /* =========================
     ⏱ TIMER
     ========================= */
  let ticPlayed = false;
  let ringing = false;

  function startTimer() {
    clearInterval(interval);

    const initial = parseInt(input.value);
    remaining = isNaN(initial) || initial <= 0 ? 20 : initial;

    button.textContent = remaining;
    state = "running";

    ticPlayed = false;
    ringing = false;

    play("start", 1);

    interval = setInterval(() => {
      if (state !== "running") return;

      remaining--;
      button.textContent = remaining;

      // 🔹 TIC : une seule fois à 5s
      if (remaining === 5 && !ticPlayed) {
        ticPlayed = true;
        play("tic", 1);
      }

      // 🔹 FIN DE CYCLE
      if (remaining === 0 && !ringing) {
        ringing = true;
        play("dring", 0.5);

        // reset cycle
        remaining = 10;
        ticPlayed = false;

        // déverrouille la sonnerie pour le prochain cycle
        setTimeout(() => {
          ringing = false;
        }, 1000);
      }
    }, 1000);
  }

  /* =========================
     🖱 EVENTS
     ========================= */
  button.addEventListener("click", async () => {
    await unlockAudio();
    startTimer();
  });

  stopButton.addEventListener("click", () => {
    state = "ready";
    clearInterval(interval);

    ticPlayed = false;
    ringing = false;

    const initial = parseInt(input.value) || 20;
    button.textContent = initial;
  });

  button.style.fontSize = "6rem";
  button.textContent = parseInt(input.value) || 20;
});
