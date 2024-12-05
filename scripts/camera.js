class Camera {
  constructor(fov = Math.PI / 2, aspectRatio = 1) {
    this.eye = vec3.fromValues(0, 0, 0);
    this.lookAt = vec3.fromValues(0, 0, 1);
    this.lookUp = vec3.fromValues(0, 1, 0);
    this.fov = fov;
    this.aspectRatio = aspectRatio;

    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
    this.dx = 0;
    this.dy = 0;
    this.dz = 0;
  }

  // TODO: construct eye, lookAt, lookUp from camera rotation and translation
  // whenever getViewingTransform is called.
  getViewingTransform() {
    const out = mat4.create();
    const center = vec3.create();
    vec3.add(center, this.eye, this.lookAt);
    mat4.lookAt(out, this.eye, center, this.lookUp);
    return out;
  }

  getPerspectiveTransform() {
    return mat4.perspective(
      mat4.create(),
      this.fov,
      this.aspectRatio,
      0.01,
      100,
    );
  }
  /*TODO: calculate lighting in world space is fine?
  the transforms applied to normal should be done with respect to the model transform, not the viewing transform
  */
  getNormalViewingTransform() {
    const out = mat3.create();
    mat3.normalFromMat4(out, this.getViewingTransform());
    return out;
  }
}
