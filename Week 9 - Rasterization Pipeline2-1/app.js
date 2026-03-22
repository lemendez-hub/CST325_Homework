'use strict'

let gl;

const appInput = new Input();
const time = new Time();
const camera = new Camera(appInput);
const assetLoader = new AssetLoader();

// this will be created after loading from a file
let groundGeometry = null;
let sphereGeometry = null;

const projectionMatrix = new Matrix4();

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
let colorProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// List of assets to load
const assetList = [
    { name: 'unlitColorVS', url: './shaders/color.unlit.vs.glsl', type: 'text' },
    { name: 'unlitColorFS', url: './shaders/color.unlit.fs.glsl', type: 'text' },
    { name: 'sphereJSON', url: './data/sphere.json', type: 'json' },
];

// -------------------------------------------------------------------------
async function initializeAndStartRendering() {
    gl = getWebGLContext("webgl-canvas");

    // load the assets in the list and wait for the process to complete
    await assetLoader.loadAssets(assetList);

    createShaders();
    createScene();

    // todo enable depth testing
    gl.enable(gl.DEPTH_TEST);

    // kick off the render loop
    updateAndRender();
}

// -------------------------------------------------------------------------
function createShaders() {
    const unlitColorVS = assetLoader.assets.unlitColorVS;
    const unlitColorFS = assetLoader.assets.unlitColorFS;

    colorProgram = createCompiledAndLinkedShaderProgram(gl, unlitColorVS, unlitColorFS);
    gl.useProgram(colorProgram);

    colorProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(colorProgram, "aVertexPosition"),
        vertexColorsAttribute: gl.getAttribLocation(colorProgram, "aVertexColor"),
    };

    colorProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(colorProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(colorProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(colorProgram, "uProjectionMatrix"),
        colorUniform: gl.getUniformLocation(colorProgram, "uColor")
    };
}

// -------------------------------------------------------------------------
function createScene() {
    groundGeometry = new WebGLGeometryQuad(gl);
    groundGeometry.create();

    // todo #1 - translate the quad so you can see it
    groundGeometry.worldMatrix.makeTranslation(0, 0, -10);

    // todo #2 - rotate and scale the quad to make it "ground-like"
    groundGeometry.worldMatrix.makeTranslation(0, -5, -10);
    groundGeometry.worldMatrix.multiply(new Matrix4().makeRotationX(Math.PI / 2));
    groundGeometry.worldMatrix.multiply(new Matrix4().makeScale(10, 4.5, 10));

    // todo #3 - create the sphere geometry
    // sphereGeometry = ?
    // sphereGeometry.create(?);

    // todo #4 - scale and translate the sphere
    // sphereGeometry.worldMatrix...
}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);
    
    time.update();
    camera.update(time.deltaTime);
    
    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    const aspectRatio = gl.canvasWidth / gl.canvasHeight;
    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);

    gl.useProgram(colorProgram);

    // render ground
    gl.uniform4f(colorProgram.uniforms.colorUniform, 0.5, 0.5, 0.5, 1.0);
    groundGeometry.render(camera, projectionMatrix, colorProgram);

    // todo #5 - change color for the sphere

    // todo #9 - animate the color of there sphere
    // todo #10 - animate the color with non-grayscale values

    // todo #3 - render the sphere
}
