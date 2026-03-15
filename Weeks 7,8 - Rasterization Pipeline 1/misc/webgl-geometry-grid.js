/**
 * WebGLGeometryGrid.js
 * --------------------
 *  A helper class that hides the boilerplate required to generate and draw
 *  a "floor" line-grid on the X-Z plane (Y = –1).  Great for orientation,
 *  debugging, or pretending you’re in the holodeck.
 *
 *  Usage:
 *      const grid = new WebGLGeometryGrid(gl);
 *      grid.create(10);  // Builds a 21 × 21 grid  (-10 … +10 in both axes)
 *
 *      // ─ In your render loop ─
 *      grid.render(camera, projectionMatrix, shaderProgram);
 *
 *  Shader expectations:
 *      attributes: { vertexPositionAttribute }
 *      uniforms:   { worldMatrixUniform, viewMatrixUniform, projectionMatrixUniform }
 */
class WebGLGeometryGrid {
    /**
     * @param {WebGLRenderingContext} gl - The WebGL context.
     */
    constructor(gl) {
        // Persist the WebGL context so every method can talk to the GPU.
        this.gl = gl;

        // 4 × 4 world transform (translate / rotate / scale the whole grid).
        this.worldMatrix = new Matrix4();

        // Vertex count for gl.drawArrays (populated in create()).
        this.bufferItemCount = 0;

        // GPU buffer (set up in create())
        this.positionBuffer = null;
    }

    // -------------------------------------------------------------------------
    /**
     * Allocates GPU buffer(s) for a (2 × size + 1)² grid.
     * @param {number} size – Half-extent of grid along +X/-X and +Z/-Z.
     */
    create(size) {
        const gl = this.gl;

        /* -----------------------------------------------------------
         * 1. Build an array of vertex positions.
         *    Two passes:
         *      a) Lines parallel to Z (vary X, clamp Z)
         *      b) Lines parallel to X (vary Z, clamp X)
         * ----------------------------------------------------------- */
        const positions = [];

        // a) North–south lines (varying X)
        for (let i = -size; i <= size; i++) {
            positions.push(
                i, -1.0, -size,  // start
                i, -1.0,  size   // end
            );
        }

        // b) East–west lines (varying Z)
        for (let i = -size; i <= size; i++) {
            // Todo #14 - Add positions for the remaining lines
            positions.push(
                -size, -1.0, i,
                size, -1.0, i
            );
        }

        gl.enable(gl.DEPTH_TEST);

        // Convert "#floats" → "#vertices"
        this.bufferItemCount = positions.length / 3;

        /* -----------------------------------------------------------
         * 2. Position Buffer Setup
         *    (Pattern identical to the triangle example.)
         * ----------------------------------------------------------- */
        // Todo #14 – Position Buffer Setup
        // 1) this.positionBuffer = /* gl.createBuffer() */ ;
        // 2) Bind it to gl.ARRAY_BUFFER
        // 3) Upload new Float32Array(positions) with gl.STATIC_DRAW
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        checkGLError(gl, "bufferData(grid positions)");
    }

    // -------------------------------------------------------------------------
    /**
     * Draws the grid.
     * @param {Camera}  camera           – Camera object (provides view matrix).
     * @param {Matrix4} projectionMatrix – Perspective or orthographic matrix.
     * @param {Object}  shaderProgram    – Compiled program + attribute/uniform
     *                                     locations (see header).
     */
    render(camera, projectionMatrix, shaderProgram) {
        const gl = this.gl;

        // Use the provided shader for all subsequent draw calls
        gl.useProgram(shaderProgram);

        // Convenience shorthands
        const attributes = shaderProgram.attributes;
        const uniforms   = shaderProgram.uniforms;

        /* -----------------------------------------------------------
         * 1. Attribute plumbing – POSITION
         * ----------------------------------------------------------- */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        // Todo #14
        // Tell WebGL how to pull data from the buffer:
        // - attribute location - vertexPositionAttribute
        // - number of components per vertex (x, y, z → 3)
        // - type of each component (FLOAT)
        // - normalization disabled
        // - stride & offset both 0 (tightly packed)
        // gl.vertexAttribPointer(?, ?, ?, ?, ?, ?);
        gl.vertexAttribPointer(attributes.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        if (attributes.vertexPositionAttribute >= 0)
            gl.enableVertexAttribArray(attributes.vertexPositionAttribute);

        /* -----------------------------------------------------------
         * 2. Upload transformation matrices
         * ----------------------------------------------------------- */
        gl.uniformMatrix4fv(uniforms.worldMatrixUniform, false, this.worldMatrix.clone().transpose().elements);
        gl.uniformMatrix4fv(uniforms.viewMatrixUniform, false, camera.getViewMatrix().clone().transpose().elements);
        gl.uniformMatrix4fv(uniforms.projectionMatrixUniform, false, projectionMatrix.clone().transpose().elements);

        /* -----------------------------------------------------------
         * 3. Draw call
         *    gl.LINES – every pair of vertices = one independent line.
         * ----------------------------------------------------------- */
        gl.drawArrays(gl.LINES, 0, this.bufferItemCount);

        // Clean-up: disable attribute so the next mesh starts with a blank slate
        if (attributes.vertexPositionAttribute >= 0) 
            gl.disableVertexAttribArray(attributes.vertexPositionAttribute);
    }
}
