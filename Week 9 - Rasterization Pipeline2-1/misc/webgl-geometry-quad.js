/*
 * A simple object to encapsulate the data and operations of object rasterization
 */
 
class WebGLGeometryQuad {
  constructor(gl) {
    this.gl = gl;
    this.worldMatrix = new Matrix4();
  }

  // -----------------------------------------------------------------------------
  create(rawImage) {
    // Define the vertices of the quad
    const verts = [
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
    ];

    // Define the normals for the quad
    const normals = [
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0
    ];

    // Define the indices for the quad (two triangles)
    const indices = [0, 1, 2, 2, 1, 3];
    this.indexCount = indices.length;

    // Create and bind the position buffer, then send data to the GPU
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);

    // Create and bind the normal buffer, then send data to the GPU
    this.normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

    // Create and bind the index buffer, then send data to the GPU
    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
  }

  // -------------------------------------------------------------------------
  render(camera, projectionMatrix, shaderProgram) {
    const gl = this.gl;
    gl.useProgram(shaderProgram);

    const attributes = shaderProgram.attributes;
    const uniforms = shaderProgram.uniforms;

    // Bind and set the vertex position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(
      attributes.vertexPositionAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(attributes.vertexPositionAttribute);

    // Bind and set the vertex normals buffer if it exists
    if (attributes.hasOwnProperty('vertexNormalsAttribute')) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      gl.vertexAttribPointer(
        attributes.vertexNormalsAttribute,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(attributes.vertexNormalsAttribute);
    }

    // Send our matrices to the shader
    gl.uniformMatrix4fv( uniforms.worldMatrixUniform, false, this.worldMatrix.clone().transpose().elements);
    gl.uniformMatrix4fv( uniforms.viewMatrixUniform, false, camera.getViewMatrix().clone().transpose().elements);
    gl.uniformMatrix4fv( uniforms.projectionMatrixUniform, false, projectionMatrix.clone().transpose().elements);

    // Bind the index buffer and draw the elements
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

    // Disable the vertex attribute arrays
    gl.disableVertexAttribArray(attributes.vertexPositionAttribute);
    if (attributes.hasOwnProperty('vertexNormalsAttribute')) {
      gl.disableVertexAttribArray(attributes.vertexNormalsAttribute);
    }
  }
}
