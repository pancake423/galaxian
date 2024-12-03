class Light {
  constructor(pos, Ka, Kd, Ks) {
    this.pos = vec3.fromValues(...pos);
    this.coeff = mat3.fromValues(...Ka, ...Kd, ...Ks);
  }
}
