/*
global variables :)
To see total lines of code written:
git ls-files | grep js | xargs wc -l
*/
const GAME_Z_PLANE = 8;
const BOSS_LEVEL = 5;

let specialUsed = false;

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
var sounds;
var aliens = [];
var bullets = [];

window.onload = () => {
  // initialize global variables
  bg = new BackgroundCanvas(document.getElementById("bg"));
  gl = document.getElementById("webgl").getContext("webgl");
  camera = new Camera();
  sounds = new Sounds();
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
  resetGlobalAlienControls();
  // load models and prepare to draw
  generateAndLoadModels();
  renderer.setCamera(camera);
  renderer.setLight(light);
  // event handlers for keeping everything connected
  events.addListener("alienKill", onAlienKilled);
  events.addListener("playerKill", onPlayerKilled);
  events.addListener("levelCleared", onLevelCleared);
  events.addListener("KeyEnter", onEnter);
  events.addListener("KeyZ", onKeyZ);
  events.addListener("special", () => {
    if (!specialUsed && !ui.titleOn) {
      specialUsed = true;
      ui.missiles = 3;
      sounds.upgrade.play();
    }
  });
  events.addListener("BracketRight", () => {
    events.raiseEvent("levelCleared");
  });
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
  if (type == "boss") {
    ui.score += 1000;
  }
}

function onPlayerKilled() {
  ui.lives--;
  if (ui.lives == 0) {
    ui.showMessage("GAME OVER", false);
    sounds.death.play();
  }
  player.despawn();
}

function onEnter() {
  if (ui.lives == 0) {
    ui.lives = 3;
    ui.score = 0;
    ui.level = 0;
    ui.missiles = 0;
    specialUsed = false;
    sounds.hum.pause();
    resetGlobalAlienControls();
    ui.hideMessage();
    events.raiseEvent("levelCleared");
  }
}

function onLevelCleared() {
  GlobalAlienControls.oscillateSpeed += 0.1;
  ui.level++;
  if (ui.level % BOSS_LEVEL == 0) {
    ui.missiles += 1;
    sounds.upgrade.play();
  } else {
    sounds.level.play();
  }
  GlobalAlienControls.descentSpeed += 0.1;
  GlobalAlienControls.descentFrequency -= 0.1;
  spawnAliens();
}

function onKeyZ() {
  if (
    ui.missiles > 0 &&
    !ui.titleOn &&
    !player.isDespawned &&
    !player.isRespawning
  ) {
    ui.missiles--;
    sounds.warp.play();
    const m = new Missile(player.x, player.y, player.z);
    bullets.push(m);
  }
}

// calculate and draw one frame of the game.
function step() {
  draw();
  if (!ui.messageOn) {
    player.update();
  }
  updateAliens();
  updateBullets();
  updateParticles();
  requestAnimationFrame(step);
}

let angle = [0, 0, 0];
function draw() {
  bg.draw();
  ui.draw();
  player.draw();
  drawAliens();
  drawBullets();
  drawParticles();
}
