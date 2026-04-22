/*
 * An object representing a Camera with position and orientation.
 */

class Camera {
  constructor(input) {
    this.cameraWorldMatrix = new Matrix4();
    this.cameraYaw = 0;
    this.cameraPosition = new Vector3();

    this.input = input;
  }

  // -------------------------------------------------------------------------
  getViewMatrix() {
    return this.cameraWorldMatrix.clone().inverse();
  }

  // -------------------------------------------------------------------------
  getRight() {
    return new Vector3(
      this.cameraWorldMatrix.elements[0],
      this.cameraWorldMatrix.elements[4],
      this.cameraWorldMatrix.elements[8]
    ).normalize();
  }

  // -------------------------------------------------------------------------
  getUp() {
    return new Vector3(
      this.cameraWorldMatrix.elements[1],
      this.cameraWorldMatrix.elements[5],
      this.cameraWorldMatrix.elements[9]
    ).normalize();
  }

  // -------------------------------------------------------------------------
  getForward() {
    return new Vector3(
      -this.cameraWorldMatrix.elements[2],
      -this.cameraWorldMatrix.elements[6],
      -this.cameraWorldMatrix.elements[10]
    );
  }

  // -------------------------------------------------------------------------
  update(dt) {
    const currentForward = this.getForward();
    const movementPerSecond = 2;

    if (this.input.up) {
      this.cameraPosition.add(currentForward.multiplyScalar(movementPerSecond * dt));
    }

    if (this.input.down) {
      this.cameraPosition.subtract(currentForward.multiplyScalar(movementPerSecond * dt));
    }

    if (this.input.left) {
      this.cameraYaw += dt * 50;
    }

    if (this.input.right) {
      this.cameraYaw -= dt * 50;
    }

    const translation = new Matrix4().makeTranslation(this.cameraPosition);
    const rotation = new Matrix4().makeRotationY(this.cameraYaw);
    this.cameraWorldMatrix.makeIdentity().multiply(translation).multiply(rotation);
  }
}
