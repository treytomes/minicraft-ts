#version 300 es
precision highp float;

in vec4 position;
out vec2 v_texcoord;

void main() {
  gl_Position = position;

  // This bit will flip the Y and put (0, 0) in the top-left corner.  Like old-school.
  v_texcoord = position.xy * vec2(0.5f, -0.5f) + 0.5f; 
  //v_texcoord = position.xy;
}
