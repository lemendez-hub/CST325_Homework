class Time {
  constructor() {
    this.secondsElapsedSinceStart = 0;
    this.lastTime = 0;
    this.deltaTime = 0;
  }

  update() {
    const currentTime = new Date().getTime();
    if (this.lastTime !== 0) {
      this.deltaTime = (currentTime - this.lastTime) / 1000.0;
      this.secondsElapsedSinceStart += this.deltaTime;
    }
    this.lastTime = currentTime;
  }
}
