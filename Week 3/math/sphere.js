class Sphere{
    constructor(center, radius) {
        // Clone the center vector to avoid external mutations
        this.center = center.clone();
        this.radius = radius;
        
        // Validate and set default values if necessary
        // - Default center: Zero vector
        // - Default radius: 1
        if (!(this.center instanceof Vector3)) {
            console.warn("Invalid center provided. Setting to default zero vector.");
            this.center = new Vector3(0, 0, 0);
        }
        
        if (typeof this.radius !== 'number' || isNaN(this.radius)) {
            console.warn("Invalid radius provided. Setting to default value of 1.");
            this.radius = 1;
        }
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
            
        // TODO: Implement the ray-sphere intersection logic

        // Recommended steps:
        // ------------------
        // 1. Understand the math: Review the basics of ray-sphere intersections. The goal is to solve 
        //    for intersection points using the quadratic equation.
        //
        // 2. Identify vectors and setup: Compute the vector from the ray's origin to the sphere's center. 
        //    Use this to derive the quadratic coefficients.
        //
        // 3. Compute the discriminant: Solve the quadratic equation. The discriminant determines if there 
        //    are real solutions and thus potential intersections.
        //
        // 4. Analyze the discriminant:
        //    - If negative, the ray misses the sphere.  Jump to step 7.
        //    - If zero or positive, calculate intersection points.
        //
        // 5. Validate intersections: Ensure the intersection is in front of the ray and the origin is 
        //    outside the sphere.
        //
        // 6. Calculate the normal vector: The normal vector is a unit vector perpendicular to the sphere's 
        //    surface at the intersection point. Hint: you can do it if you know the circle's center and 
        //    the intersection point.  Note that it must be normalized. 
        //
        // 7. Return results: If no valid intersection:
        //      return { hit: false };
        //    If valid intersection:
        //      return { hit: true, point: <Vector3>, normal: <Vector3>, distance: <Number> };
        
        
        
        // Attempted to create steps to try to do implementation correctly \\

        // 1. Get the ray origin and direction
        var rayOrigin = ray.origin; // Getting the starting point of the ray
        var rayDirection = ray.direction; // Getting the direction the ray is going
        
        // 2. Creating a vector with the length of ray origin to sphere center
        var vectorRS = this.center.clone().subtract(rayOrigin); // Creating a vector that points from the vector's origin to the sphere's center
        
        // 3. Checking if the ray starts inside the sphere
        var radiusSqrd = this.radius * this.radius; // This is Radius^2
        var vectorRS_Sqrd = vectorRS.dot(vectorRS); // The squared distance from the ray origin to the sphere center
        if(vectorRS_Sqrd < radiusSqrd){
            return; //Only happends if the origin is in the sphere
        }

        // 4. Quadratic Coefficients
        var a = rayDirection.dot(rayDirection); // The squared length of the ray direction
        var b = 2 * vectorRS.dot(rayDirection); // How aligned the ray is pointing toward/away form the center of the sphere
        var c = vectorRS_Sqrd - radiusSqrd; // Measures how far the ray origin is from the sphere surface
        return result;
    }
}