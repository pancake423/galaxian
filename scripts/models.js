MODELS_N = 20; // number of sides for spherical primitives in all models.

function generateAndLoadModels() {
  const modelGenerators = [
    [modelSpaceship, "ship"],
    [modelWaspWing, "wing1"],
    [modelDragonflyWing, "wing2"],
    [modelPlayerBullet, "pbullet"],
    [modelAlienBullet, "abullet"],
    [modelAlien1, "alien1"],
    [modelAlien2, "alien2"],
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

function stripedSphere(c1, c2, n) {
  m = new Model();
  const dphi = Math.PI / n;
  for (let i = 0; i < n; i++) {
    const phi = dphi * i;
    const stripe = new SphereSlice(
      1,
      MODELS_N,
      phi,
      phi + dphi,
      i % 2 == 0 ? c1 : c2,
    );
    m.merge(stripe);
  }
  m.rotate(90, 0, 0);
  return m;
}

function modelAlien1() {
  // wasp fella
  const bodyColor = [0.8, 0.8, 0];
  const stripeColor = [0.8, 0, 0];
  const eyeColor = [0.8, 0, 0];
  const stingerColor = [1, 1, 1];

  const headSize = 0.7;
  const headStretch = 1.3;
  const headOffset = 1.5;
  const bodyLength = 2.1;
  const bodyOffset = 2.4;
  const eyeSize = 0.45;
  const eyeOffset = 0.4;
  const bodyStretch = 1.1;
  const stingerSize = 0.2;

  const bodyStripes = 4;
  const abdStripes = 7;
  // thorax
  const wasp = stripedSphere(stripeColor, bodyColor, bodyStripes);
  // head
  const head = new SphereSlice(headSize, MODELS_N, 0, Math.PI, bodyColor);
  head.scale(1, headStretch, 1);
  head.translate(0, headOffset, 0);
  wasp.merge(head);
  // abdomen
  const abdomen = stripedSphere(bodyColor, stripeColor, abdStripes);
  abdomen.scale(bodyStretch, bodyLength, bodyStretch);
  abdomen.translate(0, -bodyOffset, 0);
  wasp.merge(abdomen);
  // eyes
  const eye = new SphereSlice(eyeSize, MODELS_N, 0, Math.PI, eyeColor);
  eye.scale(1, headStretch, 1);
  eye.translate(eyeOffset, headOffset + 0.1, -0.15);
  wasp.merge(eye);
  eye.translate(eyeOffset * -2, 0, 0);
  wasp.merge(eye);
  // stinger
  const stinger = new VarCylinder(1, 0, 1, MODELS_N, 2 * Math.PI, stingerColor);
  stinger.rotate(90, 0, 0);
  stinger.scale(stingerSize, 1, stingerSize);
  stinger.translate(0, -bodyOffset - bodyLength + 0.1, 0);
  wasp.merge(stinger);

  return standardizeModel(wasp);
}

function modelAlien2() {
  // dragonfly fella (mini boss)
  const bodyColor = [0.6, 0.6, 0.8];
  const stripeColor = [0, 0.4, 0.8];
  const eyeColor = [0.8, 0, 0];

  const headSize = 0.8;
  const headStretch = 1.3;
  const headOffset = 1.7;
  const eyeSize = 0.45;
  const eyeOffset = 0.55;

  const bodyStripes = 3;
  const tailSegments = 6;
  const tailSegmentLength = 1;
  const tailRadius = 0.3;

  const dragonfly = stripedSphere(stripeColor, bodyColor, bodyStripes);
  // head
  const head = new SphereSlice(headSize, MODELS_N, 0, Math.PI, bodyColor);
  head.scale(headStretch, 1, 1);
  head.translate(0, headOffset, 0);
  dragonfly.merge(head);
  // eyes
  const eye = new SphereSlice(eyeSize, MODELS_N, 0, Math.PI, eyeColor);
  eye.scale(headStretch, 1, 1);
  eye.translate(eyeOffset, headOffset + 0.6, -0.25);
  dragonfly.merge(eye);
  eye.translate(eyeOffset * -2, 0, 0);
  dragonfly.merge(eye);
  // tail
  for (let i = 0; i < tailSegments; i++) {
    const seg = new VarCylinder(
      tailRadius,
      i == tailSegments - 1 ? 0 : tailRadius,
      tailSegmentLength,
      MODELS_N,
      2 * Math.PI,
      i % 2 == 0 ? bodyColor : stripeColor,
    );
    seg.rotate(90, 0, 0);
    seg.translate(0, -0.5 - tailSegmentLength * i, 0);
    dragonfly.merge(seg);
  }

  return standardizeModel(dragonfly);
}

function modelAlien3() {
  // the boss (spaceship of some sort??)
}

function modelWaspWing() {
  return modelAlienWing([0, 0.4, 0.8]);
}
function modelDragonflyWing() {
  return modelAlienWing([0.6, 0, 0]);
}

function modelAlienWing(color) {
  const outHeight = 1;

  const wingThickness = 0.1;
  const wingColor = color;
  const baseWidth = 0.2;
  const midWidth = 0.7;
  const topWidth = 0.3;
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
