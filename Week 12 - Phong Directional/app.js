'use strict'

let gl;

const appInput = new Input();
const time = new Time();
const camera = new OrbitCamera(appInput);
const assetLoader = new AssetLoader();

let sphereGeometry = null; // this will be created after loading from a file
let groundGeometry = null;

const projectionMatrix = new Matrix4();
const lightPosition = new Vector4(4, 1.5, 0, 1);

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
let phongShaderProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// List of assets to load
const assetList = [
    { name: 'phongTextVS', url: './shaders/phong.vs.glsl', type: 'text' },
    { name: 'phongTextFS', url: './shaders/phong.pointlit.fs.glsl', type: 'text' },
    { name: 'sphereJSON', url: './data/sphere.json', type: 'json' },
    { name: 'marbleImage', url: './data/marble.jpg', type: 'image' },
    { name: 'crackedMudImage', url: './data/crackedmud.png', type: 'image' }
];

let yaw = 0;
let pitch = 0;

// -------------------------------------------------------------------------
async function initializeAndStartRendering() {
    gl = getWebGLContext("webgl-canvas");
    gl.enable(gl.DEPTH_TEST);

    await assetLoader.loadAssets(assetList);

    createShaders();
    createScene();

    updateAndRender();
}

// -------------------------------------------------------------------------
function createShaders() {
    const phongTextVS = assetLoader.assets.phongTextVS;
    const phongTextFS = assetLoader.assets.phongTextFS;

    phongShaderProgram = createCompiledAndLinkedShaderProgram(gl, phongTextVS, phongTextFS);

    phongShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(phongShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(phongShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(phongShaderProgram, "aTexcoords")
    };

    phongShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uProjectionMatrix"),
        uLightPosition: gl.getUniformLocation(phongShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(phongShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(phongShaderProgram, "uTexture"),
    };
}

// -------------------------------------------------------------------------
function createScene() {
    groundGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    groundGeometry.create(assetLoader.assets.crackedMudImage);

    let scale = new Matrix4().makeScale(10.0, 10.0, 10.0);

    // compensate for the model being flipped on its side
    let rotation = new Matrix4().makeRotationX(-90);

    groundGeometry.worldMatrix.makeIdentity();
    groundGeometry.worldMatrix.multiply(rotation).multiply(scale);

    sphereGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    sphereGeometry.create(assetLoader.assets.sphereJSON, assetLoader.assets.marbleImage);

    // Scaled it down so that the diameter is 3
    scale = new Matrix4().makeScale(0.03, 0.03, 0.03);

    // raise it by the radius to make it sit on the ground
    let translation = new Matrix4().makeTranslation(0, 1.5, 0);

    sphereGeometry.worldMatrix.makeIdentity();
    sphereGeometry.worldMatrix.multiply(translation).multiply(scale);

}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    const aspectRatio = gl.canvasWidth / gl.canvasHeight;

    yaw += 60 * time.deltaTime;
    const rotation = new Matrix4().makeRotationY(yaw);
    const ogLightPos = new Vector4(4, 1.5, 0, 1);
    const rotatedLight = rotation.multiplyVector(ogLightPos);
    lightPosition.x = rotatedLight.x;
    lightPosition.y = rotatedLight.y;
    lightPosition.z = rotatedLight.z;

    time.update();
    camera.update(time.deltaTime);

    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(phongShaderProgram);
    const uniforms = phongShaderProgram.uniforms;
    const cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.uLightPosition, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);
    groundGeometry.render(camera, projectionMatrix, phongShaderProgram);
    sphereGeometry.render(camera, projectionMatrix, phongShaderProgram);
}