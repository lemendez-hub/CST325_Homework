class Sphere{
    constructor(center, radius, color) {
        // Clone the center vector to avoid external mutations
       
        
        // Validate and set default values if necessary
        // - Default center: Zero vector
        // - Default radius: 1
        if (!(center instanceof Vector3)) {
            console.warn("Invalid center provided. Setting to default zero vector.");
            this.center = new Vector3(0, 0, 0);
        }else{
            this.center = center.clone();
        }
        
        if (typeof radius !== 'number' || isNaN(radius)) {
            console.warn("Invalid radius provided. Setting to default value of 1.");
            this.radius = 1;
        }else{
            this.radius = radius
        }

        if(color === undefined){
            color = new Vector3(1, 1, 1);
        }
        if(!(color instanceof Vector3)) {
            console.warn("Invalid color provided. Setting to default");
            color = new Vector3(1, 1, 1);
        }
        this.color = color;
    }
    
    /**
    * Determines whether the given ray intersects the sphere and, if so, calculates the intersection details.
    *
    * A valid intersection satisfies the following conditions:
    * 1. The intersection point is in front of the ray's origin (not behind it).
    * 2. The ray's origin is not inside the sphere.
    */
    raycast(ray) {
        // Initialize the result object with default values
        const result = {
            hit: false,      // Boolean indicating if an intersection occurred
            point: null,     // Vector3 of the intersection point
            normal: null,    // Normal vector at the intersection point
            distance: null,  // Distance from the ray origin to the intersection
            };
        
        // Attempted to create steps to try to do implementation correctly \\

        // 1. Get the ray origin and direction
        var rayOrigin = ray.origin; // Getting the starting point of the ray
        var rayDirection = ray.direction; // Getting the direction the ray is going
        
        // 2. Creating a vector with the length of ray origin to sphere center
        var vectorRS = rayOrigin.clone().subtract(this.center); // Creating a vector that points from the vector's origin to the sphere's center
        
        // 3. Checking if the ray starts inside the sphere
        var radiusSqrd = this.radius * this.radius; // This is Radius^2
        if(vectorRS.dot(vectorRS) < radiusSqrd){
            return result; //Only happends if the origin is in the sphere
        }

        // 4. Quadratic Coefficients
        var a = rayDirection.dot(rayDirection); // The squared length of the ray direction
        var b = 2 * vectorRS.dot(rayDirection); // How aligned the ray is pointing toward/away form the center of the sphere
        var c = vectorRS.dot(vectorRS) - radiusSqrd; // Measures how far the ray origin is from the sphere surface

        // 5. The Discriminant
        var discriminant = (b * b) - (4 * a * c); // Computing the discriminant
        if(discriminant < 0){
            return result; // Negative, ray missed
        }
        var dis_Sqrd = Math.sqrt(discriminant);
        var t1 = (-b - dis_Sqrd) / (2 * a); // Result 1 using "-"
        var t2 = (-b + dis_Sqrd) / (2 * a); // Result 2 using "+"

        // 6. Validating
        var t = null;
        if(t1 > 0 && t2 > 0){
            t = Math.min(t1, t2); // Closest
        }else if(t1 > 0){
            t = t1;
        }else if(t2 > 0){
            t = t2;
        }else{
            return result; // Both are behind the ray origin
        }
        var hit_Point = rayOrigin.clone().add(rayDirection.clone().multiplyScalar(t)); // calculates the intersection point
        var hit_Normal = hit_Point.clone().subtract(this.center).normalize(); // the direction the sphere surface is facing at the hit point
        result.hit = true;
        result.point = hit_Point;
        result.normal = hit_Normal;
        result.distance = t;

        return result;
    }
}