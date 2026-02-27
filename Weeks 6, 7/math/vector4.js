/*
 * An object representing a 4d vector to make operations simple and concise.
 */

class Vector4 {
  constructor(x, y, z, w) {
    this.set(x, y, z, w);
  }

  //----------------------------------------------------------------------------- 
  set(x, y, z, w) {
    this.x = Number.isFinite(x) ? x : 0;
    this.y = Number.isFinite(y) ? y : 0;
    this.z = Number.isFinite(z) ? z : 0;
    this.w = Number.isFinite(w) ? w : 0;
    return this;
  }

  //----------------------------------------------------------------------------- 
  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  //----------------------------------------------------------------------------- 
  copy(other) {
    if (!(other instanceof Vector4)) 
        throw new Error("Argument must be an instance of Vector4");

    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.w = other.w;
    return this;
  }

  //----------------------------------------------------------------------------- 
  add(v) {
    if (!(v instanceof Vector4)) 
        throw new Error("Argument must be an instance of Vector4");

    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    return this;
  }

  //----------------------------------------------------------------------------- 
  subtract(v) {
    if (!(v instanceof Vector4)) 
        throw new Error("Argument must be an instance of Vector4");

    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    return this;
  }

  //----------------------------------------------------------------------------- 
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }

  //----------------------------------------------------------------------------- 
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }

  //----------------------------------------------------------------------------- 
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  //----------------------------------------------------------------------------- 
  lengthSqr() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  //----------------------------------------------------------------------------- 
  normalize() {
    const len = this.length();
    const EPSILON = 1e-8; 

    if (len >= EPSILON) 
      this.multiplyScalar(1 / len);

    return this;
  }

  //----------------------------------------------------------------------------- 
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
  }

  //----------------------------------------------------------------------------- 
  static fromTo(fromPoint, toPoint) {
    return toPoint.clone().subtract(fromPoint);
  }

  //----------------------------------------------------------------------------- 
  static project(vectorToProject, otherVector) {
    if (!(vectorToProject instanceof Vector4) || !(otherVector instanceof Vector4)) 
        throw new Error("Both arguments must be instances of Vector4");

    const other01 = otherVector.clone().normalize();
    const projectionLength = vectorToProject.dot(other01);
    return other01.multiplyScalar(projectionLength);
  }
}
