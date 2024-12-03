/*
global variables :)
*/
var bg;
var ui;
var camera;
var light;
var gl;
var program;
var uniforms;
var renderer;

window.onload = () => {
  // initialize global variables
  bg = new BackgroundCanvas(document.getElementById("bg"));
  ui = new UICanvas(document.getElementById("ui"));
  gl = document.getElementById("webgl").getContext("webgl");
  camera = new Camera();
  light = new Light(
    (pos = [0, 0, -10]),
    (Ka = [1, 1, 1]),
    (Kd = [1, 1, 1]),
    (Ks = [1, 1, 1]),
  );
  renderer = new Renderer();
  // compile and link webgl program
  program = initProgram();
  uniforms = getUniformLocations(uniformNames);
  gl.enable(gl.DEPTH_TEST);
  // load models and prepare to draw
  initRenderer();
  TEST_SCRIPT();
  // start game loop
  step();
};
let angle = [0, 0, 0];
function TEST_SCRIPT() {
  const test = new PolyPrism(
    [
      [0, 0],
      [2, 0],
      [2, 1],
      [1, 2],
      [0, 2],
    ],
    1,
    [0.8, 0.8, 0.8],
  );
  test.scale(1, 2, 1);
  renderer.registerModel("cube", test);
  renderer.loadModels();
  renderer.setCamera(camera);
  renderer.setLight(light);
}

// read from modelFuncs
// generate + store models, initialize renderer
function initRenderer() {}

// calculate and draw one frame of the game.
function step() {
  draw();
  requestAnimationFrame(step);
}

function draw() {
  bg.draw();
  renderer.draw("cube", [0, 0, 8], angle, [1, 1, 1]);
}
