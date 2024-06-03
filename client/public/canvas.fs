#version 300 es
precision highp float;

out vec4 outColor;
in vec2 v_texcoord;
uniform sampler2D render_texture;

void main() {
  outColor = texture(render_texture, v_texcoord);
}
