abstract class GameRunner {
  looping = false;
  preloaded = false;
  targetFrameRate = 60;
  frameCount = 0;
  frameRate = 0;
  paused = false;
  stepFrames: number | null = null;
  private _lastFrameTime: number;

  constructor() {
    this._lastFrameTime = window.performance.now();

    // store this bound function so we don't have to create
    // one every single time we call requestAnimationFrame
    this._loop = this._loop.bind(this);
  }

  abstract preload(): Promise<void>;
  abstract onFrame(): void;

  async start(paused = false) {
    if (!this.preloaded) {
      if (this.preload) {
        await this.preload();
      }
      this.preloaded = true;
    }

    if (paused) {
      this.paused = paused;
    }

    this.looping = true;

    if (!paused) {
      window.requestAnimationFrame(this._loop);
    }
  }

  stop() {
    this.looping = false;
  }

  pause() {
    this.paused = true;
  }

  unpause() {
    this.paused = false;
  }

  step(frames = 1) {
    if (typeof this.stepFrames === "number") {
      this.stepFrames += frames;
    } else {
      this.stepFrames = frames;
    }

    this._loop();
  }

  _loop() {
    const now = window.performance.now();
    const timeSinceLast = now - this._lastFrameTime;
    const targetTimeBetweenFrames = 1000 / this.targetFrameRate;

    if (timeSinceLast >= targetTimeBetweenFrames - 5) {
      this.onFrame();
      this.frameRate = 1000 / (now - this._lastFrameTime);
      this._lastFrameTime = now;
      this.frameCount++;
    }

    if (this.looping) {
      let shouldLoop = true;

      if (this.paused) {
        if (typeof this.stepFrames === "number") {
          if (this.stepFrames === 0) {
            this.stepFrames = null;
            shouldLoop = false;
          } else {
            this.stepFrames--;
          }
        } else {
          shouldLoop = false;
        }
      }

      if (shouldLoop) {
        window.requestAnimationFrame(this._loop);
      }
    }
  }
}

export default GameRunner;
