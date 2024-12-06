/*
global variables :)
To see total lines of code written:
git ls-files | grep js | xargs wc -l
*/
const GAME_Z_PLANE = 8;

var bg;
var ui;
var camera;
var light;
var gl;
var program;
var uniforms;
var renderer;
var events;
var keys;
var player;
var aliens = [];
var bullets = [];

window.onload = () => {
  // initialize global variables
  bg = new BackgroundCanvas(document.getElementById("bg"));
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
  events = new EventEmitter();
  keys = new KeyTracker();
  ui = new UICanvas(document.getElementById("ui"));
  ui.showMessage("PRESS ENTER TO START", true);
  player = new Player();
  // load models and prepare to draw
  generateAndLoadModels();
  renderer.setCamera(camera);
  renderer.setLight(light);
  // event handlers for keeping everything connected
  events.addListener("alienKill", onAlienKilled);
  events.addListener("playerKill", onPlayerKilled);
  events.addListener("levelCleared", onLevelCleared);
  // start game loop
  step();
};

function onAlienKilled(type) {
  if (type == "alien1") {
    ui.score += 50;
  }
  if (type == "alien2") {
    ui.score += 100;
  }
  if (type == "alien3") {
    ui.score += 1000;
  }
}

function onPlayerKilled() {
  ui.lives--;
  player.despawn();
}

function onLevelCleared() {
  GlobalAlienControls.oscillateSpeed += 0.1;
  ui.level++;
  // TODO (when its possible): Aliens descend faster, and slightly more frequently
  spawnAliens();
}

// calculate and draw one frame of the game.
function step() {
  draw();
  player.update();
  updateAliens();
  updateBullets();
  requestAnimationFrame(step);
}

let angle = [0, 0, 0];
function draw() {
  bg.draw();
  ui.draw();
  player.draw();
  drawAliens();
  drawBullets();
}
