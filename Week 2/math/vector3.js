/*
 * An "object" representing a 3d vector to make operations simple and concise.
 *
 * Similar to how we work with plain numbers, we will work with vectors as
 * an entity unto itself.  Note the syntax below: var Vector3 = function...
 * This is different than you might be used to in most programming languages.
 * Here, the function is meant to be instantiated rather than called and the
 * instantiation process IS similar to other object oriented languages => new Vector3()
 */

class Vector3{
    constructor(x, y, z){
        // todo - make sure to set a default value in case x, y, or z is not passed in
        if(x == undefined){
            this.x = 0;
        }else{
            this.x = x;
        }
        if(y == undefined){
            this.y = 0;
        }else{
            this.y = x;
        }
        if(z == undefined){
            this.z = 0;
        }else{
            this.z = x;
        }
    }
    //----------------------------------------------------------------------------- 
    set(x, y, z){
        // todo set 'this' object's values to those from x, y, and z
        this.x = x;
        this.y = y;
        this.z - z;
        return this;
    }
    //----------------------------------------------------------------------------- 
    clone(){
        return new Vector3(this.x, this.y, this.z);
    }
    //----------------------------------------------------------------------------- 
    copy(other){
        // copy the values from other into 'this'
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }
    //----------------------------------------------------------------------------- 
    negate(){
        // multiply 'this' vector by -1
        // This SHOULD change the values of this.x, this.y, and this.z
        this.x = this.x * -1;
        this.y = this.y * -1;
        this.z = this.z * -1;
        return this;
    }
    //----------------------------------------------------------------------------- 
    add(v){
        // todo - add v to 'this' vector
        // This SHOULD change the values of this.x, this.y, and this.z
        this.x = this.x + v.x;
        this.y = this.y + v.y;
        this.z = this.z + v.z;
        return this;
    }
    //----------------------------------------------------------------------------- 
    subtract(v){
        // todo - subtract v from 'this' vector
        // This SHOULD change the values of this.x, this.y, and this.z
        this.x = this.x - v.x;
        this.y = this.y - v.y;
        this.z = this.z - v.z;
        return this;
    }
    //----------------------------------------------------------------------------- 
    multiplyScalar(scalar) {
        // multiply 'this' vector by "scalar"
        // This SHOULD change the values of this.x, this.y, and this.z
        return this;
    }

    //----------------------------------------------------------------------------- 
    length() {
        // todo - return the magnitude (A.K.A. length) of 'this' vector
        // This should NOT change the values of this.x, this.y, and this.z
        return 0;
    }

    //----------------------------------------------------------------------------- 
    lengthSqr() {
        // todo - return the squared magnitude of this vector ||v||^2
        // This should NOT change the values of this.x, this.y, and this.z

        // There are many occasions where knowing the exact length is unnecessary 
        // and the square can be substituted instead (for performance reasons).  
        // This function should NOT have to take the square root of anything.
        return 0;
    }

    //----------------------------------------------------------------------------- 
    normalize() {
        // todo - Change the components of this vector so that its magnitude will equal 1.
        // This SHOULD change the values of this.x, this.y, and this.z
        return this;
    }

    //----------------------------------------------------------------------------- 
    dot(other) {
        // todo - return the dot product between this vector and "other"
        // This should NOT change the values of this.x, this.y, and this.z
        return 0;
    }

    //============================================================================= 
    // The functions below must be completed in order to receive an "A"


    //----------------------------------------------------------------------------- 
    rescale(newScale) {
        // todo - Change this vector's length to be newScale
        return this;
    }

    //----------------------------------------------------------------------------- 
    static fromTo(fromPoint, toPoint) {
        if (!(fromPoint instanceof Vector3) || !(toPoint instanceof Vector3)) {
            console.error("fromTo requires two vectors: 'from' and 'to'");
        }
        // todo - return the vector that goes from "fromPoint" to "toPoint"
        //        NOTE - "fromPoint" and "toPoint" should not be altered
    }

    //----------------------------------------------------------------------------- 
    static angle(v1, v2) {
        // todo - calculate the angle in degrees between vectors v1 and v2. Do NOT
        //        change any values on the vectors themselves
        return 0;
    }

    //----------------------------------------------------------------------------- 
    static project(vectorToProject, otherVector) {
        // todo - return a vector that points in the same direction as "otherVector"
        //        but whose length is the projection of "vectorToProject" onto "otherVector"
        //        NOTE - "vectorToProject" and "otherVector" should NOT be altered (i.e. use clone)
        //        See "Vector Projection Slides" under "Extras" for more info.
    }
}
