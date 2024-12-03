const uniformNames = [
  "u_model_mat_normal",
  "u_view_mat",
  "u_model_mat",
  "u_perspective_mat",
  "u_light_pos",
  "u_eye_pos",
  "u_light_coeff",
  "u_material_coeff",
  "u_n",
];
const shaders = {
  vertex: `

  precision mediump float;

  attribute vec3 a_position;
  attribute vec3 a_normal;
  attribute vec2 a_tex_coords;

  varying vec2 v_tex_coords;
  varying vec3 v_normal;
  varying vec3 v_position;

  uniform mat3 u_model_mat_normal;
  uniform mat4 u_view_mat;
  uniform mat4 u_model_mat;
  uniform mat4 u_perspective_mat;

  void main() {
    gl_Position = u_perspective_mat * u_view_mat * u_model_mat * vec4(a_position, 1.0);
    v_tex_coords = a_tex_coords;
    v_normal = u_model_mat_normal * a_normal;
    v_position = (u_model_mat * vec4(a_position, 1.0)).xyz;
  }
  `,
  // TODO: lighting in fragment shader
  fragment: `
  precision highp float;

  varying vec2 v_tex_coords;
  varying vec3 v_normal;
  varying vec3 v_position;

  // webgl is too smart and its ignoring attributes that are unused currently :)
  uniform vec3 u_light_pos;
  uniform vec3 u_eye_pos;
  uniform mat3 u_light_coeff;
  uniform mat3 u_material_coeff;
  uniform float u_n;

  void main() {
    // blinn-phong lighting (adopted from program 3 shell code)
    // ambient term
    vec3 ambient = u_light_coeff[0] * u_material_coeff[0];

    // diffuse term
    vec3 normal = normalize(v_normal);
    vec3 light = normalize(u_light_pos - v_position);
    float lambert = max(0.0,dot(normal,light));
    vec3 diffuse = (u_light_coeff[1] * u_material_coeff[1]) * lambert; // diffuse term

    // specular term
    vec3 eye = normalize(u_eye_pos - v_position);
    vec3 halfVec = normalize(light+eye);
    float highlight = pow(max(0.0,dot(normal,halfVec)), u_n);
    vec3 specular = u_light_coeff[2]*u_material_coeff[2]*highlight; // specular term

    // combine to output color
    gl_FragColor = vec4(ambient + diffuse + specular, 1);
  }
  `,
};
