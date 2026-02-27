/*
 * An "object" representing a 3d vector to make operations simple and concise.
 *
 * Similar to how we work with plain numbers, we will work with vectors as
 * an entity unto itself.  Note the syntax below: class Vector3
 * This is different than you might be used to in most programming languages.
 * Here, the class is meant to be instantiated rather than called and the
 * instantiation process IS similar to other object oriented languages => new Vector3()
 */

class Vector3 {
    constructor(x, y, z) {
        this.x = Number.isFinite(x) ? x : 0;
        this.y = Number.isFinite(y) ? y : 0;
        this.z = Number.isFinite(z) ? z : 0;
    }

    //----------------------------------------------------------------------------- 
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    //----------------------------------------------------------------------------- 
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    //----------------------------------------------------------------------------- 
    copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }

    //----------------------------------------------------------------------------- 
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    //----------------------------------------------------------------------------- 
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    //----------------------------------------------------------------------------- 
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    //----------------------------------------------------------------------------- 
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    //----------------------------------------------------------------------------- 
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    //----------------------------------------------------------------------------- 
    lengthSqr() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    //----------------------------------------------------------------------------- 
    normalize() {
        this.multiplyScalar(1 / this.length());
        return this;
    }

    //----------------------------------------------------------------------------- 
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    //----------------------------------------------------------------------------- 
    fromTo(fromPoint, toPoint) {
        if (!(fromPoint instanceof Vector3) || !(toPoint instanceof Vector3)) {
            console.error("fromTo requires two vectors: 'from' and 'to'");
        }
        return toPoint.clone().subtract(fromPoint);
    }

    //----------------------------------------------------------------------------- 
    rescale(newScale) {
        const magnitude = this.length();
        if (magnitude > 0) {
            this.normalize();
            this.multiplyScalar(newScale);
        }
        return this;
    }

    //----------------------------------------------------------------------------- 
    static fromTo(fromPoint, toPoint) {
        if (!(fromPoint instanceof Vector3) || !(toPoint instanceof Vector3)) {
            console.error("fromTo requires two vectors: 'from' and 'to'");
        }
        return toPoint.clone().subtract(fromPoint);
    }

    //----------------------------------------------------------------------------- 
    static angle(v1, v2) {
        const dotProd = v1.dot(v2);
        const radAngle = Math.acos(dotProd / (v1.length() * v2.length()));
        return (radAngle * 180) / Math.PI;
    }

    //----------------------------------------------------------------------------- 
    static project(vectorToProject, otherVector) {
        const other01 = otherVector.clone().normalize();
        const projectionLength = vectorToProject.dot(other01);
        return other01.multiplyScalar(projectionLength);
    }
}

