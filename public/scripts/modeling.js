/*
Idea: a 'model' class that just holds a collection of verticess, colors, normals, triangles
model class has capabilities to apply transforms to itself: rotate, translate, scale
model class can merge with other model classes

shapes that we want to generate inherit from 'model', and basically just have a fancy constructor
that builds the shape as specified.

shapes:
  cylinder (variable top and bottom radius)
  half-cylinder
  cone
  polygon prism
  elipsoid (with stripes?)
  octahedron (bullets)

models are then generated and stored in a Renderer
once all models are stored, the Renderer loads them into webgl
the Renderer can then have a function for drawing the specified model at any position in the world
also needs a function for specifying the camera and light position
*/

// list of functions that generate models when called.
const modelFuncs = [];

class Model {
  constructor() {
    this.v = []; // vertices
    this.n = []; // normal vectors
    this.c = []; // colors
    this.t = []; // triangles; indices into other 3 lists
  }

  translate(x, y, z) {
    this.#applyMatrix(mat4.fromTranslation(mat4.create(), [x, y, z]));
  }

  rotate(x, y, z) {
    const q = quat.create();
    quat.fromEuler(q, x, y, z);
    this.#applyMatrix(mat4.fromQuat(mat4.create(), q));
  }

  scale(x, y, z) {
    this.#applyMatrix(mat4.fromScaling(mat4.create(), [x, y, z]));
  }

  #applyMatrix(m) {
    // m is a mat4
    // compute mat3 to apply to normal vector
    // apply to v and n respectively
    const nm = mat3.normalFromMat4(mat3.create(), m);
    this.v = this.v.map((v) =>
      mat4.multiply(vec4.create(), m, [...v, 1]).slice(0, 3),
    );
    this.n = this.n.map((n) => mat3.multiply(vec3.create(), nm, n));
  }
}

class PolyPrism extends Model {
  // a polygon in the xy-plane, given a height in the z plane to become 3d.
  constructor(points, height, color) {
    super();
    const l = points.length;
    // bottom face
    // radial points of poly
    for (let i = 0; i < l; i++) {
      this.v.push([...points[i], 0]);
      this.n.push([0, 0, -1]);
      this.c.push(color);
    }
    // triangles
    for (let i = 1; i < l - 1; i++) {
      this.t.push([0, i, i + 1]);
    }
    // top face
    // radial points of poly
    for (let i = 0; i < l; i++) {
      this.v.push([...points[i], height]);
      this.n.push([0, 0, 1]);
      this.c.push(color);
    }
    // triangles
    for (let i = 1; i < l - 1; i++) {
      this.t.push([l, l + i, l + i + 1]);
    }
    //side faces
    for (let i = 0; i < l; i++) {
      const offset = this.v.length;
      const p1 = points[i];
      const p2 = points[utils.mod(i + 1, l)];
      const center = utils.center(points);
      // TODO (if I remember): add vec library to utils, use that instead
      const normal = [...utils.norm(utils.sub(utils.add(p1, p2), center)), 0];
      console.log(utils.sub(utils.add(p1, p2), center));
      console.log(normal);
      this.v.push([...p1, 0]);
      this.v.push([...p1, height]);
      this.v.push([...p2, height]);
      this.v.push([...p2, 0]);
      for (let j = 0; j < 4; j++) {
        this.n.push(normal);
        this.c.push(color);
      }
      this.t.push([offset + 0, offset + 1, offset + 2]);
      this.t.push([offset + 2, offset + 3, offset + 0]);
    }
  }
}
