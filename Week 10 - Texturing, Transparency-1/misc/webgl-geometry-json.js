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
class WebGLGeometryJSON {
    constructor(gl) {
        this.gl = gl;
        this.worldMatrix = new Matrix4();
        this.alpha = 1;
    }

    // -----------------------------------------------------------------------------
    getPosition() {
        // todo #10 - return a vector4 of this object's world position contained in its matrix
    }

    // -----------------------------------------------------------------------------
    create(jsonFileData, rawImage) {
        // fish out references to relevant data pieces from 'data'
        const verts = jsonFileData.meshes[0].vertices;
        const normals = jsonFileData.meshes[0].normals;
        const texcoords = jsonFileData.meshes[0].texturecoords[0];
        const indices = [].concat(...jsonFileData.meshes[0].faces);

        // create the position and color information for this object and send it to the GPU
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

        this.texcoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texcoords), this.gl.STATIC_DRAW);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        // store all of the necessary indexes into the buffer for rendering later
        this.indexCount = indices.length;

        if (rawImage) {
            // todo #4
            // 1. create the texture (uncomment when ready)
            this.texture = gl.createTexture();

            // 2. todo bind the texture
            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            // needed for the way browsers load images, ignore this
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

            // 3. todo set wrap modes (for s and t) for the texture
            gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

            // 4. todo set filtering modes (magnification and minification)
            gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            
            // 5. send the image WebGL to use as this texture
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rawImage);

            // todo #6 - set up trilinear filtering
            gl.generateMipmap(this.gl.TEXTURE_2D);
            gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);

            // We're done for now, unbind
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
    }

    // -------------------------------------------------------------------------
    render(camera, projectionMatrix, shaderProgram) {
        this.gl.useProgram(shaderProgram);

        const attributes = shaderProgram.attributes;
        const uniforms = shaderProgram.uniforms;

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

        if (attributes.hasOwnProperty('vertexNormalsAttribute')) {
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

        if (attributes.hasOwnProperty('vertexTexcoordsAttribute')) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
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

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        if (this.texture && uniforms.textureUniform) {
            // todo #6
            // uncomment when ready
            this.gl.activeTexture(gl.TEXTURE0);
            this.gl.bindTexture(gl.TEXTURE_2D, this.texture);
            // send texture uniform to shader
            this.gl.uniform1i(uniforms.textureUniform, 0);
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

        this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);

        if (this.texture && uniforms.textureUniform) 
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        this.gl.disableVertexAttribArray(attributes.vertexPositionAttribute);
        if (attributes.vertexNormalsAttribute) 
            this.gl.disableVertexAttribArray(attributes.vertexNormalsAttribute);

        if (attributes.vertexTexcoordsAttribute) 
            this.gl.disableVertexAttribArray(attributes.vertexTexcoordsAttribute);
    }
}
