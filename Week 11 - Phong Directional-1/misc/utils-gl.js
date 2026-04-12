// -------------------------------------------------------------------------
// Initialize and return the WebGL context
function getWebGLContext(canvasID) {
    let canvas = document.getElementById(canvasID);

    try {
        var gl = canvas.getContext("webgl", { alpha: false });
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;
        return gl;
    } catch (e) {
        console.error('Failed to initialize WebGL:', e);
    }

    if (!gl) {
        alert("Could not initialize WebGL, sorry :-(");
    }

    return null;
}

// -------------------------------------------------------------------------
function createCompiledShader(gl, shaderText, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.error('Shader compilation failed:', error);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// -----------------------------------------------------------------------------
function createCompiledAndLinkedShaderProgram(gl, vertexShaderText, fragmentShaderText) {
    const vertexShader = createCompiledShader(gl, vertexShaderText, gl.VERTEX_SHADER);
    const fragmentShader = createCompiledShader(gl, fragmentShaderText, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
        console.error('Failed to compile shaders.');
        return null;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(shaderProgram);
        console.error('Program linking failed:', error);
        gl.deleteProgram(shaderProgram);
        return null;
    }

    return shaderProgram;
}

// -------------------------------------------------------------------------
function checkFrameBufferStatus() {
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    switch(status) {
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            console.log('framebuffer incomplete: attachment');
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            console.log('framebuffer incomplete: missing attachment');
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            console.log('framebuffer incomplete: dimensions');
            break;
        case gl.FRAMEBUFFER_UNSUPPORTED:
            console.log('framebuffer incomplete: unsupported');
            break;
    }
}

