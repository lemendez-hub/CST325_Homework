precision mediump float;

// Todo #10 - declare vVertexColor varying

varying vec3 vVertexColor;

void main(void) {
    // Use this line below instead once you've hooked up color
    gl_FragColor = vec4(vVertexColor, 1.0);

}

