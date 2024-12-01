class WebGLCanvas extends CanvasBase {
  constructor(canvas) {
    super(canvas);
    this.gl = this.canvas.getContext("webgl");
  }
}
