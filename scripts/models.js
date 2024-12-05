MODELS_N = 20; // number of sides for spherical primitives in all models.

function generateAndLoadModels() {
  const modelGenerators = [
    [modelSpaceship, "ship"],
    [modelAlienWing, "wing"],
    [modelPlayerBullet, "pbullet"],
    [modelAlienBullet, "abullet"],
    /*[modelAlien1, "alien1"],
    [modelAlien2, "alien2"],*/
  ];
  for (const g of modelGenerators) {
    const model = g[0]();
    const name = g[1];
    renderer.registerModel(name, model);
  }
  renderer.loadModels();
}
// applies scaling and translation to M such that
// it is centered in and contained by the bounding box from [-1, 1] in all dimensions
// DANGER: NOT FUNCTIONAL, modifies m and returns it.
function standardizeModel(m) {
  // find the largest and smallest value of x, y, and z
  const dims = [0, 1, 2].map((i) => [
    Math.min(...m.v.map((v) => v[i])),
    Math.max(...m.v.map((v) => v[i])),
  ]);
  m.translate(...dims.map((d) => (d[1] + d[0]) / -2));
  const scale = 2 / Math.max(...dims.map((d) => d[1] - d[0]));
  m.scale(scale, scale, scale);
  return m;
}

function modelSpaceship() {
  // constants that define the spaceship's appearance
  const bodyColor = [0.8, 0.8, 0.8];
  const visorColor = [0.8, 0.2, 0.2];
  const tubeColor = [0.4, 0.4, 0.4];

  const bodyLength = 3;
  const bodyTaper = 0.9;

  const noseLength = 2.5;

  const wsSize = 0.8;
  const wsLength = 2.3;

  const wingWidth = 3.5;
  const wingHeight = 2.25;
  const wingThickness = 0.3;
  const wingOffset = 0.5;

  const tubeX = [-4, -2, 2, 4];
  const tubeLength = [0.75, 1, 1, 0.75];
  const tubeWidth = 0.25;
  const tubeOffset = 0.35;

  // assemble ship from primitives
  const spaceship = new VarCylinder(
    bodyTaper,
    1,
    bodyLength,
    MODELS_N,
    2 * Math.PI,
    bodyColor,
  );
  const noseBottom = new SphereSlice(
    1,
    MODELS_N,
    0,
    Math.PI / 2,
    bodyColor,
    (closed = true),
  );
  noseBottom.rotate(90, 0, 0);
  noseBottom.scale(1, 1, noseLength);
  noseBottom.translate(0, 0, bodyLength);

  spaceship.merge(noseBottom);
  const windshield = new SphereSlice(1, MODELS_N, 0, Math.PI / 2, visorColor);
  windshield.rotate(-90, 0, 0);
  windshield.scale(wsSize, wsSize, wsLength);
  windshield.translate(0, 0, bodyLength);
  spaceship.merge(windshield);
  spaceship.rotate(-90, 0, 0);

  const wing = new PolyPrism(
    [
      [0, 0],
      [0, 1],
      [1, 0.5],
      [1, 0],
    ],
    wingThickness,
    bodyColor,
  );
  wing.scale(wingWidth, wingHeight, 1);
  wing.translate(bodyTaper, wingOffset, -wingThickness / 2);
  spaceship.merge(wing);
  wing.scale(-1, 1, 1);
  spaceship.merge(wing);

  const tube = new VarCylinder(
    0.25,
    0.25,
    wingHeight,
    MODELS_N,
    2 * Math.PI,
    tubeColor,
  );
  tube.rotate(-90, 0, 0);
  for (let i = 0; i < tubeX.length; i++) {
    tube.scale(1, tubeLength[i], 1);
    tube.translate(tubeX[i], tubeOffset, tubeWidth);
    spaceship.merge(tube);
    tube.translate(-tubeX[i], -tubeOffset, -tubeWidth);
    tube.scale(1, 1 / tubeLength[i], 1);
  }

  return standardizeModel(spaceship);
}

function modelAlien1() {}

function modelAlien2() {}

function modelAlienWing() {
  const outHeight = 0.5;

  const wingThickness = 0.1;
  const wingColor = [0.8, 0.8, 0.8];
  const baseWidth = 0.45;
  const midWidth = 1;
  const topWidth = 0.55;
  const midHeight = 1;
  const topHeight = 1.5;
  wing = new PolyPrism(
    [
      [-baseWidth / 2, 0],
      [baseWidth / 2, 0],
      [midWidth / 2, midHeight],
      [topWidth / 2, topHeight],
      [-topWidth / 2, topHeight],
      [-midWidth / 2, midHeight],
    ],
    wingThickness,
    wingColor,
  );
  wing.scale(
    (1 / topHeight) * outHeight,
    (1 / topHeight) * outHeight,
    (1 / topHeight) * outHeight,
  );
  return wing;
}

function modelBullet(color) {
  const length = 4;
  const bullet = new SphereSlice(1, MODELS_N / 2, 0, Math.PI, color);
  bullet.scale(1, length, 1);

  return standardizeModel(bullet);
}

function modelPlayerBullet() {
  const color = [1, 0, 0];
  return modelBullet(color);
}

function modelAlienBullet() {
  const color = [0, 0.5, 1];
  return modelBullet(color);
}
