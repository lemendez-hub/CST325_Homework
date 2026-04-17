precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // diffuse contribution
    // todo #1 normalize the light direction and store in a separate variable
    vec3 normalizedLP = normalize(uLightPosition - vWorldPosition);
    // todo #2 normalize the world normal and store in a separate variable
    vec3 normalizedWN = normalize(vWorldNormal);
    // todo #3 calculate the lambert term
    float lambert = max(dot(normalizedWN, normalizedLP), 0.0);

    // specular contribution
    // todo #4 in world space, calculate the direction from the surface point to the eye (normalized)
    vec3 direction = normalize(uCameraPosition - vWorldPosition);
    // todo #5 in world space, calculate the reflection vector (normalized)
    vec3 reflection = normalize(reflect(-normalizedLP, normalizedWN));
    // todo #6 calculate the phong term
    float phong = pow(max(dot(direction, reflection), 0.0), 64.0);
    // combine
    // todo #7 apply light and material interaction for diffuse value by using the texture color as the material
    // todo #8 apply light and material interaction for phong, assume phong material color is (0.3, 0.3, 0.3)

    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    vec3 ambient = albedo * 0.1;
    vec3 diffuseColor = albedo * lambert;
    vec3 specularColor = vec3(0.3, 0.3, 0.3) * phong;

    // todo #9
    // add "diffuseColor" and "specularColor" when ready
    vec3 finalColor = ambient + diffuseColor + specularColor;

    gl_FragColor = vec4(finalColor, 1.0);
}