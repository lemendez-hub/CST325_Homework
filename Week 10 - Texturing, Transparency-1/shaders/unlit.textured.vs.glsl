precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTexcoords;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

// todo #2 - make sure to pass texture coordinates for interpolation to fragment shader (varying)
// - Declare the variable correctly
// - Set it correctly inside main
varying vec2 textCoords;

void main(void) {
    textCoords = aTexcoords;
    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);
}

