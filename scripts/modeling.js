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

  merge(m) {
    // yoink the vertices and triangles from the provided model
    // don't forget to offset the triangle indices!
    const offset = this.v.length;
    for (let i = 0; i < m.v.length; i++) {
      this.v.push(m.v[i]);
      this.n.push(m.n[i]);
      this.c.push(m.c[i]);
    }
    for (let i = 0; i < m.t.length; i++) {
      this.t.push(m.t[i].map((idx) => idx + offset));
    }
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

// "variable cylinder" can be used to form cones, cylinders, or slanted cylinders.
class VarCylinder extends Model {
  // rb -> bottom of cylinder radius
  // rt -> top of cylinder radius
  // h -> cylinder height
  // n -> number of points in circles
  // t -> max. value of theta (up to 2*Math.PI)
  // color => list of [r, g, b] (values between 0 and 1)
  constructor(rb, rt, h, n, t, color) {
    super();
    let offset = 0;
    // bottom circle
    const bottomCircle = [];
    const delta = t / (n - 1);
    for (let i = 0; i < n; i++) {
      bottomCircle.push([rb * Math.cos(i * delta), rb * Math.sin(i * delta)]);
    }
    this.v.push([0, 0, 0]);
    this.n.push([0, 0, -1]);
    this.c.push(color);

    for (let i = 0; i < n; i++) {
      this.v.push([...bottomCircle[i], 0]);
      this.n.push([0, 0, -1]);
      this.c.push(color);
      this.t.push([0, i + 1, utils.mod(i + 1, n) + 1]);
    }
    offset += n + 1;
    // top circle
    const topCircle = [];
    for (let i = 0; i < n; i++) {
      topCircle.push([rt * Math.cos(i * delta), rt * Math.sin(i * delta)]);
    }
    this.v.push([0, 0, h]);
    this.n.push([0, 0, 1]);
    this.c.push(color);
    for (let i = 0; i < n; i++) {
      this.v.push([...topCircle[i], h]);
      this.n.push([0, 0, 1]);
      this.c.push(color);
      this.t.push([offset, offset + i + 1, offset + utils.mod(i + 1, n) + 1]);
    }
    offset += n + 1;
    // cone sides
    const normalZ = (Math.sign(rb - rt) * Math.pow(rb - rt, 2)) / h;
    for (let i = 0; i < n; i++) {
      this.v.push([...bottomCircle[i], 0]);
      this.n.push(utils.norm([...bottomCircle[i], normalZ]));
      this.c.push(color);
    }
    for (let i = 0; i < n; i++) {
      this.v.push([...topCircle[i], h]);
      this.n.push(utils.norm([...topCircle[i], normalZ]));
      this.c.push(color);
    }
    for (let i = 0; i < n; i++) {
      this.t.push([offset + i, offset + utils.mod(i + 1, n), offset + n + i]);
      this.t.push([
        offset + n + i,
        offset + n + utils.mod(i + 1, n),
        offset + utils.mod(i + 1, n),
      ]);
    }
  }
}

// sphereSlice can easily be used to just make spheres, or it can be used to make striped spheres :)
class SphereSlice extends Model {
  constructor(r, n, phi1, phi2, color, closed = false) {
    super();
    // bands of circles
    // normal is just equal to coordinates :)
    const toCart = (r, theta, phi) => [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    ];
    const dtheta = (2 * Math.PI) / n;
    const dphi = (phi2 - phi1) / (n - 1);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const theta = dtheta * j;
        const phi = phi1 + dphi * i;
        const p = toCart(r, theta, phi);
        this.v.push(p);
        this.n.push(utils.norm(p));
        this.c.push(color);
        // no triangles formed on last row of points
        if (i !== n - 1) {
          this.t.push([i * n + j, i * n + utils.mod(j + 1, n), i * n + j + n]);
          this.t.push([
            i * n + j + n,
            i * n + utils.mod(j + 1, n) + n,
            i * n + utils.mod(j + 1, n),
          ]);
        }
      }
    }

    const addCircle = (r, phi, offset, normal) => {
      for (let i = 0; i < n; i++) {
        const theta = dtheta * i;
        this.v.push(toCart(r, theta, phi));
        this.n.push(normal);
        this.c.push(color);
        if (i > 0 && i < n - 1) {
          this.t.push([offset, offset + i, offset + i + 1]);
        }
      }
    };
    if (closed) {
      if (phi1 != 0) {
        addCircle(r, phi1, this.v.length, [0, 0, 1]);
      }
      if (phi2 != Math.PI) {
        addCircle(r, phi2, this.v.length, [0, 0, -1]);
      }
    }
  }
}
