/**
 * The OrbitCamera class provides a 3D orbit-style camera system 
 * via mouse inputs to rotate around a target point.  
 */
class OrbitCamera {
    constructor() {
        this.cameraWorldMatrix = new Matrix4();
        this.cameraTarget = new Vector4(0, 0, 0, 1);
        this.yawDegrees = 0;
        this.pitchDegrees = -45;
        this.minDistance = 1;
        this.maxDistance = 30;
        this.zoomScale = 1;

        let lastMouseX = 0;
        let lastMouseY = 0;
        let isDragging = false;

        // -------------------------------------------------------------------------
        this.getViewMatrix = function () {
            return this.cameraWorldMatrix.clone().inverse();
        }

        // -----------------------------------------------------------------------------
        this.getPosition = function() {
            return new Vector4(
                this.cameraWorldMatrix.elements[3],
                this.cameraWorldMatrix.elements[7],
                this.cameraWorldMatrix.elements[11],
                1
            );
        }

        // -------------------------------------------------------------------------
        this.update = function () {
            const tether = new Vector4(0, 0, this.minDistance + (this.maxDistance - this.minDistance) * this.zoomScale, 0);
            const yaw = new Matrix4().makeRotationY(this.yawDegrees);
            const pitch = new Matrix4().makeRotationX(this.pitchDegrees);
            
            let transformedTether = pitch.multiplyVector(tether);
            transformedTether = yaw.multiplyVector(transformedTether);

            const position = this.cameraTarget.clone().add(transformedTether);
            this.lookAt(position, new Vector4(0, 0, 0, 1));
        }

        // -------------------------------------------------------------------------
        this.lookAt = function (eyePos, targetPos) {
            const worldUp = new Vector4(0, 1, 0, 0);

            const cross = (v1, v2) => {
                return new Vector4(
                    v1.y * v2.z - v1.z * v2.y,
                    v1.z * v2.x - v1.x * v2.z,
                    v1.x * v2.y - v1.y * v2.x,
                    0
                );
            }

            this.cameraWorldMatrix.makeIdentity();

            const forward = targetPos.clone().subtract(eyePos).normalize();
            const right = cross(forward, worldUp).normalize();
            const up = cross(right, forward);

            const e = this.cameraWorldMatrix.elements;
            e[0] = right.x; e[1] = up.x; e[2] = -forward.x; e[3] = eyePos.x;
            e[4] = right.y; e[5] = up.y; e[6] = -forward.y; e[7] = eyePos.y;
            e[8] = right.z; e[9] = up.z; e[10] = -forward.z; e[11] = eyePos.z;
            e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;

            return this;
        };

        // -------------------------------------------------------------------------
        document.onmousedown = (evt) => {
            isDragging = true;
            lastMouseX = evt.pageX;
            lastMouseY = evt.pageY;
        }

        // -------------------------------------------------------------------------
        document.onmousemove = (evt) => {
            if (isDragging) {
                this.yawDegrees -= (evt.pageX - lastMouseX) * 0.5;
                this.pitchDegrees -= (evt.pageY - lastMouseY) * 0.5;

                this.pitchDegrees = Math.min(this.pitchDegrees, 85);
                this.pitchDegrees = Math.max(this.pitchDegrees, -85);

                lastMouseX = evt.pageX;
                lastMouseY = evt.pageY;
            }
        }

        // -------------------------------------------------------------------------
        document.onmousewheel = (evt) => {
            this.zoomScale -= evt.wheelDelta * 0.001;
            this.zoomScale = Math.min(this.zoomScale, 1);
            this.zoomScale = Math.max(this.zoomScale, 0);
        }

        // -------------------------------------------------------------------------
        document.onmouseup = (evt) => {
            isDragging = false;
        }
    }
}