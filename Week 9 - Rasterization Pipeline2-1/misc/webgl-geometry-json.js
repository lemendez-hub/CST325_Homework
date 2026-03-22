/*
 * A simple object to encapsulate the data and operations of object rasterization sourced from a JSON file
 */

class WebGLGeometryJSON {
  constructor(gl) {
    this.gl = gl;
    this.worldMatrix = new Matrix4();
  }

  // -----------------------------------------------------------------------------
  create(jsonFileData) {
    // Fish out references to relevant data pieces from 'jsonFileData'
    const verts = jsonFileData.meshes[0].vertices;
    const normals = jsonFileData.meshes[0].normals;

    // Store all of the necessary indexes into the buffer for rendering later
    const indices = [].concat(...jsonFileData.meshes[0].faces);
    this.indexCount = indices.length;

    // Create the position information for this object and send it to the GPU
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);

    // Create the normal information for this object and send it to the GPU
    this.normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

    // Create the index buffer for this object and send it to the GPU
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
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
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

    // Bind the index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // Send our matrices to the shader
    gl.uniformMatrix4fv(uniforms.worldMatrixUniform, false, this.worldMatrix.clone().transpose().elements);
    gl.uniformMatrix4fv(uniforms.viewMatrixUniform, false, camera.getViewMatrix().clone().transpose().elements);
    gl.uniformMatrix4fv(uniforms.projectionMatrixUniform, false, projectionMatrix.clone().transpose().elements);

    // Draw the elements
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

    // Disable the vertex attribute arrays
    gl.disableVertexAttribArray(attributes.vertexPositionAttribute);
    if (attributes.hasOwnProperty('vertexNormalsAttribute')) {
      gl.disableVertexAttribArray(attributes.vertexNormalsAttribute);
    }
  }
}
