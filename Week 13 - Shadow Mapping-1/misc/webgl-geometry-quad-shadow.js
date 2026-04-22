/*
 * A simple object to encapsulate the data and operations of object rasterization
 */
class WebGLGeometryQuad {
    constructor(gl) {
        this.gl = gl;
        this.worldMatrix = new Matrix4();
    }

    create(rawImage) {
        const verts = [
            -1.0, -1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0,  1.0, 0.0,
            -1.0,  1.0, 0.0,
             1.0, -1.0, 0.0,
             1.0,  1.0, 0.0
        ];

        const normals = [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ];

        const uvs = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ];

        // Create the position and color information for this object and send it to the GPU
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

        this.texCoordsBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);

        if (rawImage) {
            this.texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                rawImage
            );
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
    }

    render(camera, projectionMatrix, shaderProgram, shadowTexture) {
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

        if (attributes.hasOwnProperty('vertexTexCoordsAttribute')) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordsBuffer);
            this.gl.vertexAttribPointer(
                attributes.vertexTexCoordsAttribute,
                2,
                this.gl.FLOAT,
                false,
                0,
                0
            );
            this.gl.enableVertexAttribArray(attributes.vertexTexCoordsAttribute);
        }

        if (this.texture) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.uniform1i(uniforms.albedoTextureUniform, 0);
        }

        if (shadowTexture) {
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, shadowTexture);
            this.gl.uniform1i(uniforms.shadowTextureUniform, 1);
        }

        // Send our matrices to the shader
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

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        this.gl.disableVertexAttribArray(attributes.vertexPositionAttribute);
        if (attributes.hasOwnProperty('vertexNormalsAttribute')) {
            this.gl.disableVertexAttribArray(attributes.vertexNormalsAttribute);
        }
        if (attributes.hasOwnProperty('vertexTexCoordsAttribute')) {
            this.gl.disableVertexAttribArray(attributes.vertexTexCoordsAttribute);
        }
    }
}
