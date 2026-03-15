precision mediump float;

attribute vec3 aVertexPosition;
// Todo #10 - declare "aVertexColor" attribute

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

// Todo #10 - declare "vVertexColor" varying 
// A varying is used to pass data from the vertex shader to the fragment shader.
// Each vertex outputs its own varying value; the GPU then interpolates these values across the surface
// of the primitive (e.g., a triangle) based on each fragment's proximity to surrounding vertices.

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);

    // Todo #10 - assign aVertexColor to vVertexColor
    // This varying (vVertexColor) will be interpolated by the GPU across the primitive's surface.
    // Each vertex shader invocation outputs a unique vVertexColor, and the GPU smoothly blends these values
    // for each fragment. The fragment shader receives these interpolated values under the same name (vVertexColor).
}

