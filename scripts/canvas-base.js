class CanvasBase {
  constructor(canvas) {
    this.canvas = canvas;
    this.#updateSize();
    window.onresize = () => this.#updateSize();
  }
  #updateSize() {
    const size = Math.floor(
      Math.min(window.innerWidth, window.innerHeight) *
        getComputedStyle(document.body).getPropertyValue(
          "--game-viewport-percentage",
        ),
    );
    this.canvas.width = size;
    this.canvas.height = size;
    this.w = size;
    this.h = size;
  }
}
