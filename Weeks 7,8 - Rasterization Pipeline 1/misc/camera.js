/*
 * An object representing a Camera with position and orientation.
 */

class Camera {
    constructor() {
        // The camera's world matrix is used to construct the view matrix
        this.cameraWorldMatrix = new Matrix4();
    }

    // -------------------------------------------------------------------------
    getViewMatrix() {
        return this.cameraWorldMatrix.clone().inverse();
    }

    // -------------------------------------------------------------------------
    update(dt) {
    // In the next assignment, we will implement the camera update logic here.
    }
}
