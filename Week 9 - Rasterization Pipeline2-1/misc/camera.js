/*
 * An object representing a Camera with position and orientation.
 */

class Camera {
  constructor(input) {
    // The following two parameters will be used to create the cameraWorldMatrix in this.update()
    this.cameraYaw = 0;
    this.cameraPosition = new Vector3();

    this.cameraWorldMatrix = new Matrix4();

    this.input = input;
  }

  // -------------------------------------------------------------------------
  getViewMatrix() {
    return this.cameraWorldMatrix.clone().inverse();
  }

  // -------------------------------------------------------------------------
  getForward() {
    // todo #6 - pull out the forward direction from the world matrix and return as a vector
    //         - recall that the camera looks in the "backwards" direction
    var camE = this.cameraWorldMatrix.elements;
    return new Vector3(-camE[8], -camE[9], -camE[10]).normalize();
  }

  // -------------------------------------------------------------------------
  update(dt) {
    const currentForward = this.getForward();

    if (this.input.up) {
      // todo #7 - move the camera position a little bit in its forward direction
      this.cameraPosition.add(currentForward.clone().multiplyScalar(5 * dt));
    }

    if (this.input.down) {
      // todo #7 - move the camera position a little bit in its backward direction
      this.cameraPosition.subtract(currentForward.clone().multiplyScalar(5 * dt));
    }

    if (this.input.left) {
      // todo #8 - add a little bit to the current camera yaw
      this.cameraYaw += 90 * dt;
    }

    if (this.input.right) {
      // todo #8 - subtract a little bit from the current camera yaw
      this.cameraYaw -= 90 * dt;
    }

    // todo #7 - create the cameraWorldMatrix from scratch based on this.cameraPosition
    this.cameraWorldMatrix.makeTranslation(this.cameraPosition);

    // todo #8 - create a rotation matrix based on cameraYaw and apply it to the cameraWorldMatrix
    // (order matters!)
    this.cameraWorldMatrix.multiply(new Matrix4().makeRotationY(this.cameraYaw));
  }
}
// B portion completed 9:41 pm 3/21/2026