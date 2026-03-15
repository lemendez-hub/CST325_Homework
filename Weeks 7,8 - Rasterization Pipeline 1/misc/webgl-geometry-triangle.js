/**
 * WebGLGeometryTriangle.js
 * ------------------------
 * A helper class to encapsulate the data setup and rendering logic
 * for drawing a single, colored triangle in WebGL.
 *
 * Usage:
 *   const triangle = new WebGLGeometryTriangle(gl);
 *   triangle.create();
 * 
 *   In your render loop:
 *   triangle.render(camera, projectionMatrix, shaderProgram);
 *
 */
class WebGLGeometryTriangle {
    /**
     * @param {WebGLRenderingContext} gl - The WebGL context.
     */
    constructor(gl) {
        // Store the WebGL rendering context for later use
        this.gl = gl;
        
        // A 4x4 matrix representing the triangle's world transform
        // (position, rotation, scale in world space).
        this.worldMatrix = new Matrix4();
    
        // How many vertices we will draw (computed in create()).
        this.bufferItemCount = 0;
    
        // GPU buffers (set up in create())
        this.positionBuffer = null;
        this.colorBuffer = null;
    }

    // -------------------------------------------------------------------------
    /**
     * Builds GPU buffers for the triangle's vertex positions and colors.
     * Call this once after creating the object.
     */
    create() {
        const gl = this.gl;

        // Define the 3D coordinates for each corner of a triangle:
        //    (0, 1, 0)   -> Top point
        //    (-1,-1, 0)  -> Bottom-left
        //    (1, -1, 0)  -> Bottom-right
        const positions = [
            0.0,  1.0, 0.0,
           -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0
        ];

        // Calculate how many vertices: total floats ÷ floats per vertex (3)
        this.bufferItemCount = positions.length / 3;

        // Todo #6 - Position Buffer Setup
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        checkGLError(gl, "bufferData(position)");

        // Define RGB colors for each vertex:
        //    Top = red, Left = green, Right = blue
        const colors = [
            1.0, 0.0, 0.0, // Red (tip)
            0.0, 1.0, 0.0, // Green (base left)
            0.0, 0.0, 1.0, // Blue (base right)
        ];

        // Todo #9 - Color Buffer Setup
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        // 1) this.colorBuffer = /* Create the buffer */;
        // 2) Bind it to the ARRAY_BUFFER binding point
        // 3) Upload the color data into the buffer as 32-bit floats
        checkGLError(gl, "bufferData(color)");
    }

    // -------------------------------------------------------------------------
    /**
     * Renders the triangle to the screen.
     * @param {Camera} camera - Camera object providing view matrix.
     * @param {Matrix4} projectionMatrix - Projection matrix (perspective or ortho).
     * @param {Object} shaderProgram - Contains compiled WebGLProgram and locations:
     *   - attributes: { vertexPositionAttribute, vertexColorsAttribute? }
     *   - uniforms: { worldMatrixUniform, viewMatrixUniform, projectionMatrixUniform }
     */
    render(camera, projectionMatrix, shaderProgram) {
        const gl = this.gl;

        // Tell WebGL which shader program to use for subsequent draw calls
        gl.useProgram(shaderProgram);

        // Shortcut references to attribute & uniform locations
        const attributes = shaderProgram.attributes;
        const uniforms   = shaderProgram.uniforms;

        // Position attribute
        // Bind the buffer with vertex positions
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        // Todo #7 - Tell WebGL how to pull data from the buffer:
        // - attribute location - vertexPositionAttribute
        // - number of components per vertex (x, y, z → 3)
        // - type of each component (FLOAT)
        // - normalization disabled
        // - stride & offset both 0 (tightly packed)
        gl.vertexAttribPointer(attributes.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        // Enable this attribute for use during drawing
        if (attributes.vertexPositionAttribute >= 0)
            gl.enableVertexAttribArray(attributes.vertexPositionAttribute);

        // Color attribute
        if (attributes.vertexColorsAttribute !== undefined && attributes.vertexColorsAttribute >= 0) {
            // Todo #12 - bind color and use vertexAttribPointer for it 
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(attributes.vertexColorsAttribute, 3, gl.FLOAT, false, 0, 0);
            
            gl.enableVertexAttribArray(attributes.vertexColorsAttribute);
        }

        if (uniforms.viewMatrixUniform === null || uniforms.projectionMatrixUniform === null)
            throw new Error("View or projection uniform not found.");

        // Upload transformation matrices to shader uniforms
        gl.uniformMatrix4fv(uniforms.worldMatrixUniform, false, this.worldMatrix.clone().transpose().elements);
        // Todo #8 - Upload the remaining transformation matrices

        gl.uniformMatrix4fv(uniforms.viewMatrixUniform, false, camera.getViewMatrix().clone().transpose().elements);
        gl.uniformMatrix4fv(uniforms.projectionMatrixUniform, false, projectionMatrix.clone().transpose().elements);
    

        // Finally, draw the triangle:
        // - mode: TRIANGLES (draws one triangle per set of 3 vertices)
        // - first index: 0
        // - count: number of vertices

        gl.drawArrays(gl.TRIANGLES, 0, this.bufferItemCount);

        // Clean up state by disabling vertex attributes
        if (attributes.vertexPositionAttribute >= 0)
            gl.disableVertexAttribArray(attributes.vertexPositionAttribute);

        if (attributes.vertexColorsAttribute >= 0) {
            gl.disableVertexAttribArray(attributes.vertexColorsAttribute);
        }
    }
}
