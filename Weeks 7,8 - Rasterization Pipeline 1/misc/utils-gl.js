// -------------------------------------------------------------------------
// Initialize and return the WebGL context
function getWebGLContext() {
    // todo #1 get a reference to the canvas object
    let canvasID = "webgl-canvas";

    let canvas = document.getElementById(canvasID);
    let gl;

    try {
        gl = canvas.getContext("webgl", { alpha: false });

        // Store canvas dimensions
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


// -----------------------------------------------------------------------------
function createCompiledAndLinkedShaderProgram(gl, vertexShaderText, fragmentShaderText) {
    // Compile each shader from their source code
    const vertexShader = createCompiledShader(gl, vertexShaderText, gl.VERTEX_SHADER);
    const fragmentShader = createCompiledShader(gl, fragmentShaderText, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
        console.error('Failed to compile shaders.');
        return null;
    }
    
    // Create a new shader program object, set the shaders that belong it, and link them
    // Todo #5
    // 1) const shaderProgram = /*create the program object*/; 
    // 2) Attach the compiled vertex shader
    // 3) Attach the compiled fragment shader
    // 4) Link the shaders in the program
    
    // Ensure that linking was successful
    try {
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(shaderProgram);
            console.error('Program linking failed:', error);
            gl.deleteProgram(shaderProgram);
            return null;
        }
        return shaderProgram;
    } catch (error) {
        console.warn('Unable to link shaders');
        return null;
    }
}

// -------------------------------------------------------------------------
function createCompiledShader(gl, shaderText, shaderType) {
    // Todo #4
    // 1) const shader = /*create the shader object*/; 
    // 2) Attach the Shader Source Code
    // 3) Compile the shader

    try {
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            console.error('Shader compilation failed:', error);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    catch(e) {
        console.warn("Unable to compile shader");

    }
}

// -------------------------------------------------------------------------
function checkFrameBufferStatus(gl) {
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    switch(status) {
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            console.log('Framebuffer incomplete: attachment');
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            console.log('Framebuffer incomplete: missing attachment');
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            console.log('Framebuffer incomplete: dimensions');
            break;
        case gl.FRAMEBUFFER_UNSUPPORTED:
            console.log('Framebuffer unsupported');
            break;
        default:
            // Framebuffer is complete
            break;
    }
}

// -------------------------------------------------------------------------
function checkGLError(gl, label) {
    const error = gl.getError();
    if (error !== gl.NO_ERROR) 
        console.error(`[GL ERROR] ${label}:`, error);
}
