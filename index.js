/*
global variables :)
To see total lines of code written:
git ls-files | grep js | xargs wc -l
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
  generateAndLoadModels();
  renderer.setCamera(camera);
  renderer.setLight(light);
  // start game loop
  step();
};

// calculate and draw one frame of the game.
function step() {
  draw();
  //angle[2] += 0.1;
  angle[1] += 0.5;
  requestAnimationFrame(step);
}
//[pitch, roll, yaw]
let angle = [0, 0, 0];
function draw() {
  bg.draw();
  renderer.draw("ship", [0, 0, 3], angle, [1, 1, 1]);
}
