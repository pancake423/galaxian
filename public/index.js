/*
global variables :)
*/
var bg;
var ui;
var camera;
var gl;
var program;
var uniforms;

window.onload = () => {
  // initialize global variables
  bg = new BackgroundCanvas(document.getElementById("bg"));
  ui = new UICanvas(document.getElementById("ui"));
  gl = document.getElementById("webgl").getContext("webgl");
  camera = new Camera();
  // compile and link webgl program
  program = initProgram();
  uniforms = getUniformLocations(uniformNames);
  gl.enable(gl.DEPTH_TEST);

  // start game loop
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
