/**
 * This class encapsulates the data and operations needed for rasterizing
 * geometric objects in WebGL. It provides functionality to:
 * 
 * - Define object geometry (vertices, normals, texture coordinates, and indices)
 * - Upload data to the GPU using WebGL buffers
 * - Handle textures for textured rendering
 * - Render the object with support for vertex attributes and uniform data
 * 
 * Usage:
 * 1. Instantiate the class with a WebGL rendering context.
 * 2. Call `create()` to initialize the object's buffers and (optionally) textures.
 * 3. Use `render()` to draw the object with the desired shader program and matrices.
 */
class WebGLGeometryQuad {
    constructor(gl) {
        this.gl = gl;
        this.worldMatrix = new Matrix4();
        this.alpha = 1.0; 
    }

    // -----------------------------------------------------------------------------
    getPosition() {
        // todo #10 - return a vector4 of this object's world position contained in its matrix
    }

    // -----------------------------------------------------------------------------
    create(rawImage) {
        const verts = [
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0
        ];

        const normals = [
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0
        ];

        const uvs = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];

        const indices = [0, 1, 2, 2, 1, 3];
        this.indexCount = indices.length;

        // create the position and normal information for this object and send it to the GPU
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

        this.texCoordsBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        // If a raw image is provided, create a texture and configure it
        if (rawImage) {
            // todo #4 
            // 1. create the texture (uncomment when ready)
            this.texture = gl.createTexture();

            // 2. bind the texture
            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            // needed for the way browsers load images, ignore this
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

            // 3. set wrap modes (for s and t) for the texture
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            // 4. set filtering modes (magnification and minification)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // 5. send the image WebGL to use as this texture
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rawImage);

            // todo #6 - set up trilinear filtering
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

            // We're done for now, unbind
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
    }

    // -----------------------------------------------------------------------------
    render(camera, projectionMatrix, shaderProgram) {
        this.gl.useProgram(shaderProgram);

        const attributes = shaderProgram.attributes;
        const uniforms   = shaderProgram.uniforms;

        // Bind and set the vertex positions
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(
            attributes.vertexPositionAttribute,
            3,
            this.gl.FLOAT,
            false,
            0,
            0
        );
        this.gl.enableVertexAttribArray(attributes.vertexPositionAttribute);

        // Bind and set the vertex normals if this attribute exists
        if (attributes.vertexNormalsAttribute !== undefined && attributes.vertexNormalsAttribute !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
            this.gl.vertexAttribPointer(
                attributes.vertexNormalsAttribute,
                3,
                this.gl.FLOAT,
                false,
                0,
                0
            );
            this.gl.enableVertexAttribArray(attributes.vertexNormalsAttribute);
        }

        // Bind and set the texture coordinates if this attribute exists
        if (attributes.vertexTexcoordsAttribute !== undefined && attributes.vertexTexcoordsAttribute !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordsBuffer);
            this.gl.vertexAttribPointer(
                attributes.vertexTexcoordsAttribute,
                2,
                this.gl.FLOAT,
                false,
                0,
                0
            );
            this.gl.enableVertexAttribArray(attributes.vertexTexcoordsAttribute);
        }

        // Bind the index buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // If we have a texture, bind it to texture unit 0 and assign to the sampler
        if (this.texture) {
            // todo #4
            // uncomment when ready
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            // send texture uniform to shader
            gl.uniform1i(uniforms.textureUniform, 0);
        }

        // Send our uniforms to the shader
        this.gl.uniformMatrix4fv(
            uniforms.worldMatrixUniform,
            false,
            this.worldMatrix.clone().transpose().elements
        );
        this.gl.uniformMatrix4fv(
            uniforms.viewMatrixUniform,
            false,
            camera.getViewMatrix().clone().transpose().elements
        );
        this.gl.uniformMatrix4fv(
            uniforms.projectionMatrixUniform,
            false,
            projectionMatrix.clone().transpose().elements
        );
        this.gl.uniform1f(uniforms.alphaUniform, this.alpha);

        // Draw the geometry
        this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);

        // Unbind the texture if it was bound
        if (this.texture) 
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        // Disable the vertex attribute arrays
        this.gl.disableVertexAttribArray(attributes.vertexPositionAttribute);

        if (attributes.vertexNormalsAttribute !== undefined && attributes.vertexNormalsAttribute !== -1) 
            this.gl.disableVertexAttribArray(attributes.vertexNormalsAttribute);

        if (attributes.vertexTexcoordsAttribute !== undefined && attributes.vertexTexcoordsAttribute !== -1) 
            this.gl.disableVertexAttribArray(attributes.vertexTexcoordsAttribute);
    }
}
