/* */
var bg;
var webgl;
var ui;

window.onload = () => {
  bg = new BackgroundCanvas(document.getElementById("bg"));
  ui = new UICanvas(document.getElementById("ui"));
  webgl = new WebGLCanvas(document.getElementById("webgl"));
  step();
};

// calculate and draw one frame of the game.
function step() {
  draw();
  requestAnimationFrame(step);
}

function draw() {
  bg.draw();
}
