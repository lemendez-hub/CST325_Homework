precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoords;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uLightVPMatrix;

varying vec2 vTexCoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

varying vec4 vLightSpacePosition;

void main(void) {
    vec4 worldPosition = uWorldMatrix * vec4(aVertexPosition, 1.0);

    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);
    vTexCoords = aTexCoords;
    vWorldNormal = (uWorldMatrix * vec4(aNormal, 0.0)).xyz;
    // vWorldPosition = (uWorldMatrix * vec4(aVertexPosition, 1.0)).xyz;
    vWorldPosition = worldPosition.xyz;
    
    vLightSpacePosition = uLightVPMatrix * worldPosition;
}

