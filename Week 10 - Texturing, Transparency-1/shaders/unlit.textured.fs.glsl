precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

// todo #3 - receive texture coordinates and verify correctness by 
// using them to set the pixel color 
varying vec2 textCoords;

void main(void) {
    // todo #5 - sample a color from the texture and visualize
    vec4 texColor = texture2D(uTexture, textCoords);
    gl_FragColor = vec4(texColor.rgb, uAlpha);
}


