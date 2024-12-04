// tenatively done. everything needs to be tested
class Renderer {
  constructor() {
    this.v = [];
    this.n = [];
    this.c = [];
    this.t = [];
    this.modelIndices = {};
  }
  registerModel(name, model) {
    const vertexOffset = this.v.length;
    const triangleOffset = this.t.length;
    this.v = this.v.concat(model.v);
    this.n = this.n.concat(model.n);
    this.c = this.c.concat(model.c);
    this.t = this.t.concat(model.t.map((t) => t.map((i) => i + vertexOffset)));
    this.modelIndices[name] = [triangleOffset, model.t.length];
    // NOTE: these indices are into the 2D array. for the final draw call,
    // they will have to be multiplied by 3
  }
  loadModels() {
    // load attributes into webgl.
    initBuffer("a_position", this.v);
    initBuffer("a_normal", this.n);
    initBuffer("a_color", this.c);

    // load triangle indices into ELEMENT_ARRAY_BUFFER
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(utils.flatten(this.t)),
      gl.STATIC_DRAW,
    );
  }
  setCamera(camera) {
    // sets the webgl uniforms associated w/ the current camera position:
    // viewing transform
    gl.uniformMatrix4fv(
      uniforms["u_view_mat"],
      false,
      camera.getViewingTransform(),
    );
    // perspective transform
    gl.uniformMatrix4fv(
      uniforms["u_perspective_mat"],
      false,
      camera.getPerspectiveTransform(),
    );
    // eye position
    gl.uniform3fv(uniforms["u_eye_pos"], camera.eye);
  }
  setLight(light) {
    // sets the webgl uniforms associated w/ the current light position:
    // light position
    gl.uniform3fv(uniforms["u_light_pos"], light.pos);
    // light properties
    gl.uniformMatrix3fv(uniforms["u_light_coeff"], false, light.coeff);
  }
  clear() {
    // clear screen and depth buffers
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
  draw(name, translation, rotation, scale) {
    // draws the specified model with the given transformations applied (assumes models are centered at the origin).
    // all transformations are 3-vectors.

    // 1. construct model transform (and corresponding normal transform) matrix.
    const modelTransform = mat4.create();
    const modelNormalTransform = mat3.create();
    const q = quat.create();
    quat.fromEuler(q, ...rotation);
    mat4.fromRotationTranslationScale(modelTransform, q, translation, scale);
    mat3.normalFromMat4(modelNormalTransform, modelTransform);

    // 2. pass matrices to webgl unforms
    gl.uniformMatrix4fv(uniforms["u_model_mat"], false, modelTransform);
    gl.uniformMatrix3fv(
      uniforms["u_model_mat_normal"],
      false,
      modelNormalTransform,
    );

    // 3. call drawElements with the right indices
    const offset = this.modelIndices[name][0] * 3 * 2; // 2 bytes per unsigned short
    const length = this.modelIndices[name][1] * 3; // 3 vertices per triangle
    gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, offset);
  }
}
