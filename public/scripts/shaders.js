const uniformNames = [
  "u_model_mat_normal",
  "u_view_mat",
  "u_model_mat",
  "u_perspective_mat",
  "u_light_pos",
  "u_eye_pos",
  "u_light_coeff",
];
const shaders = {
  vertex: `

  precision mediump float;

  attribute vec3 a_position;
  attribute vec3 a_normal;
  attribute vec3 a_color;

  varying vec3 v_normal;
  varying vec3 v_position;
  varying vec3 v_color;

  uniform mat3 u_model_mat_normal;
  uniform mat4 u_view_mat;
  uniform mat4 u_model_mat;
  uniform mat4 u_perspective_mat;

  void main() {
    gl_Position = u_perspective_mat * u_view_mat * u_model_mat * vec4(a_position, 1.0);
    v_normal = u_model_mat_normal * a_normal;
    v_position = (u_model_mat * vec4(a_position, 1.0)).xyz;
    v_color = a_color;
  }
  `,
  // TODO: lighting in fragment shader
  fragment: `
  precision highp float;

  varying vec3 v_normal;
  varying vec3 v_position;
  varying vec3 v_color;

  uniform vec3 u_light_pos;
  uniform vec3 u_eye_pos;
  uniform mat3 u_light_coeff;

  const float n = 5.0;

  void main() {
    vec3 specular_coeff = v_color * 0.5;
    vec3 ambient_coeff = v_color * 0.2;
    // blinn-phong lighting (adopted from program 3 shell code)
    // ambient term
    vec3 ambient = u_light_coeff[0] * ambient_coeff;

    // diffuse term
    vec3 normal = normalize(v_normal);
    vec3 eye = normalize(u_eye_pos - v_position);

    vec3 light = normalize(u_light_pos - v_position);
    float lambert = max(0.0,dot(normal,light));
    vec3 diffuse = (u_light_coeff[1] * v_color) * lambert; // diffuse term

    // specular term
    vec3 halfVec = normalize(light+eye);
    float highlight = pow(max(0.0,dot(normal,halfVec)), n);
    vec3 specular = u_light_coeff[2]*specular_coeff*highlight; // specular term

    // combine to output color
    gl_FragColor = vec4(ambient + diffuse + specular, 1); //ambient + diffuse + specular
  }
  `,
};
