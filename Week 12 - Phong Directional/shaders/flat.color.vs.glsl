attribute vec3 aVertexPos;
uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main(){
    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPos, 1.0);
}