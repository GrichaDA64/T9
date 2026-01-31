document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     🧠 MACHINE D’ÉTAT
     ========================= */
  const TimerState = Object.freeze({
    READY: "ready",
    RUNNING: "running",
    STOPPED: "stopped"
  });

  let state = TimerState.READY;
  let initialDuration = 20;

  function setState(next) {
    state = next;
  }

  /* =========================
     🔊 AUDIO SERVICE
     ========================= */
  class AudioService {
    constructor() {
      this.ctx = null;
      this.buffers = {};
      this.unlocked = false;
    }

    async unlock() {
      if (this.unlocked) return;

      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      await this.ctx.resume();

      await Promise.all([
        this.load("start", "reset.mp3"),
        this.load("tic", "tic.mp3"),
        this.load("dring", "dring.mp3")
      ]);

      this.unlocked = true;
    }

    async load(name, url) {
      const res = await fetch(url);
      const data = await res.arrayBuffer();
      this.buffers[name] = await this.ctx.decodeAudioData(data);
    }

    play(name, volume = 1) {
      const buffer = this.buffers[name];
      if (!buffer) return;

      const src = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();

      src.buffer = buffer;
      gain.gain.value = volume;

      src.connect(gain);
      gain.connect(this.ctx.destination);
      src.start();
    }
  }

  const audio = new AudioService();

  /* =========================
     ⏱ TIMER LOGIQUE PUR
     ========================= */
  class PreciseTimer {
    constructor(onTick, onCycleEnd) {
      this.onTick = onTick;
      this.onCycleEnd = onCycleEnd;
      this.interval = null;
      this.endTime = 0;
      this.lastSecond = null;
    }

    start(durationSec) {
      this.stop();
      this.endTime = performance.now() + durationSec * 1000;
      this.lastSecond = null;
      this.interval = setInterval(() => this.tick(), 100);
    }

    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }

    tick() {
      const now = performance.now();
      const remainingMs = this.endTime - now;
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      if (remainingSec !== this.lastSecond) {
        this.onTick(this.lastSecond, remainingSec);

        if (this.lastSecond === 1 && remainingSec === 0) {
          this.onCycleEnd();
        }

        this.lastSecond = remainingSec;
      }
    }
  }

  /* =========================
     🖱 UI / ADAPTATEUR
     ========================= */
  const button = document.getElementById("timerButton");
  const input = document.getElementById("durationInput");
  const stopButton = document.getElementById("stopButton");

  const timer = new PreciseTimer(
    (prev, current) => {
      button.textContent = current;

      if (prev === 6 && current === 5) {
        audio.play("tic", 1);
      }
    },
    () => {
      audio.play("dring", 0.5);
      timer.start(initialDuration);
      audio.play("start", 1);
    }
  );

  async function start() {
    if (state === TimerState.RUNNING) return;

    await audio.unlock();

    const parsed = parseInt(input.value);
    initialDuration = isNaN(parsed) || parsed <= 0 ? 20 : parsed;

    audio.play("start", 1);
    timer.start(initialDuration);
    setState(TimerState.RUNNING);
  }

  function stop() {
    timer.stop();
    setState(TimerState.STOPPED);

    const value = parseInt(input.value);
    button.textContent = isNaN(value) || value <= 0 ? initialDuration : value;
  }

  button.addEventListener("click", start);
  stopButton.addEventListener("click", stop);

  button.style.fontSize = "6rem";
  button.textContent = parseInt(input.value) || initialDuration;
});
