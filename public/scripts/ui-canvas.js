class UICanvas extends CanvasBase {
  constructor(canvas) {
    super(canvas);
    this.ctx = this.canvas.getContext("2d");
  }
}
