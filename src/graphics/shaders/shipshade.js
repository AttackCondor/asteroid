// Vertex Shader
var SHIP_VSHADER =
  `precision mediump float;
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ModelMatrix;
  uniform float u_Boost;
  varying vec4 v_Color;

  void main() {
    if(a_Color == vec4(1.0, 1.0, 0.0, 1.0) && u_Boost == 0.0){ v_Color = vec4(0.0, 0.0, 0.0, 1.0);}
    else {v_Color = a_Color;}
    gl_Position = u_ModelMatrix * a_Position;
  }`;

// Fragment Shader
var SHIP_FSHADER =
  `precision mediump float;
  varying vec4 v_Color;

  void main() {
    gl_FragColor = v_Color;
  }`;
