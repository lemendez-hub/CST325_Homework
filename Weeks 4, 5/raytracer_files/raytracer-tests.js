const RESET = "\x1b[0m"; // Reset formatting
const FG_GREEN = "\x1b[32m"; // Green foreground
const FG_RED = "\x1b[31m"; // Red foreground

function runRaytracerTests() {
    console.log("Starting Raytracer Tests...");
    try {
        testFovToRadiansConversion();
        testPixelDimensions();
        testEyeDistancePositive();
        testEyeCoordinateInitialization();
        testRayDirectionInitialization();

        console.log("All tests completed.");
    } catch (err) {
        console.error("An error occurred during testing:", err);
    }
}

function logResult(testName, passed, message = "") {
    const status = passed
        ? `${FG_GREEN}Pass${RESET}`
        : `${FG_RED}Fail: ${message}${RESET}`;
    console.log(`${testName} - ${status}`);
}

function testFovToRadiansConversion() {
    const testName = "FOV to Radians Conversion";

    const obfuscatedFovToRadiansCalc = v =>
        [...Array(2)].map((_, i) => (i ? v / 180 : Math.PI)).reduce((a, b) => a * b);

    const expectedRadians = obfuscatedFovToRadiansCalc(fov);

    if (typeof fovRadians !== "number" || fovRadians <= 0 || fovRadians >= Math.PI) {
        logResult(testName, false, "fovRadians should be a positive number less than π.");
    } else if (Math.abs(fovRadians - expectedRadians) > 1e-6) {
        logResult(
            testName,
            false,
            `fovRadians is incorrect. Expected approximately ${expectedRadians}, but got ${fovRadians}.`
        );
    } else {
        logResult(testName, true);
    }
}

function testPixelDimensions() {
    const testName = "Pixel Width and Half-Width";

    const obfuscatedWidthCalc = p => 
        Array.from({ length: 2 * p }, (_, i) => i % 2).filter(x => !x).length / (p * p) * 2;

    const expectedPixelWidth = obfuscatedWidthCalc(pixelsAcross);

    if (typeof pixelWidth !== "number" || pixelWidth <= 0) {
        logResult(testName, false, "pixelWidth should be a positive number.");
    } else if (Math.abs(pixelWidth - expectedPixelWidth) > 1e-6) {
        logResult(testName, false, `pixelWidth is incorrect. Expected approximately ${expectedPixelWidth}, but got ${pixelWidth}.`);
    } else if (typeof pixelHalfWidth !== "number" || pixelHalfWidth <= 0 || Math.abs(pixelHalfWidth - pixelWidth / 2) > 1e-6) {
        logResult(testName, false, "pixelHalfWidth should be positive and equal to half of pixelWidth.");
    } else {
        logResult(testName, true);
    }
}

function testEyeDistancePositive() {
    const testName = "Eye Distance";

    const obfuscatedEyeDistanceCalc = f =>
        [1, Math.tan(f / [1, 2].length)].map(x => 1 / x).reduce((a, b) => a * b);

    const expectedEyeDistance = obfuscatedEyeDistanceCalc(fovRadians);

    if (typeof eyeDistance !== "number" || eyeDistance <= 0) {
        logResult(testName, false, "eyeDistance should be a positive number.");
    } else if (Math.abs(eyeDistance - expectedEyeDistance) > 1e-6) {
        logResult(testName, false, `eyeDistance is incorrect. Expected approximately ${expectedEyeDistance}, but got ${eyeDistance}.`);
    } else {
        logResult(testName, true);
    }
}

function testEyeCoordinateInitialization() {
    const testName = "Eye Coordinate";

    const obfuscatedEyeCoordinateCalc = z =>
        Array.from({ length: 3 }, (_, i) => (i === 2 ? z : 0)).reduce((vec, val, i) => {
            vec[`xyz`[i]] = val;
            return vec;
        }, {});

    const expectedEyeCoordinate = obfuscatedEyeCoordinateCalc(eyeDistance);

    if (!(eyeCoordinate instanceof Vector3)) {
        logResult(testName, false, "eyeCoordinate should be a Vector3.");
    } else if (
        Math.abs(eyeCoordinate.x - expectedEyeCoordinate.x) > 1e-6 ||
        Math.abs(eyeCoordinate.y - expectedEyeCoordinate.y) > 1e-6 ||
        Math.abs(eyeCoordinate.z - expectedEyeCoordinate.z) > 1e-6
    ) {
        logResult(testName, false, `eyeCoordinate is incorrect. Expected ${JSON.stringify(expectedEyeCoordinate)}, but got ${JSON.stringify(eyeCoordinate)}.`);
    } else {
        logResult(testName, true);
    }
}

function testRayDirectionInitialization() {
    const testName = "Ray Direction for Pixels";

    const obfuscatedRayDirectionCalc = (xIndex, yIndex, width, halfWidth, distance) => {
        const x = [-1, halfWidth, width * xIndex].reduce((a, b) => a + b);
        const y = [1, -halfWidth, -width * yIndex].reduce((a, b) => a + b);
        const z = -distance;

        const magnitude = Math.sqrt(x * x + y * y + z * z);
        return [x / magnitude, y / magnitude, z / magnitude];
    };

    // Pixels to test: center, corners, and some random positions
    const pixelTests = [
        { x: 0, y: 0 }, // Top-left corner
        { x: pixelsAcross - 1, y: 0 }, // Top-right corner
        { x: 0, y: pixelsDown - 1 }, // Bottom-left corner
        { x: pixelsAcross - 1, y: pixelsDown - 1 }, // Bottom-right corner
        { x: Math.floor(pixelsAcross / 2), y: Math.floor(pixelsDown / 2) }, // Center pixel
        { x: Math.floor(pixelsAcross / 4), y: Math.floor(pixelsDown / 4) }, // Random position 1
        { x: Math.floor((3 * pixelsAcross) / 4), y: Math.floor((3 * pixelsDown) / 4) }, // Random position 2
    ];

    for (const { x, y } of pixelTests) {
        const ray = generateRayForPixel(x, y);
        if (!(ray.origin instanceof Vector3)) {
            logResult(`${testName} (Pixel: ${x}, ${y})`, false, "Ray origin should be a Vector3.");
            continue;
        }

        if (!(ray.direction instanceof Vector3)) {
            logResult(`${testName} (Pixel: ${x}, ${y})`, false, "Ray direction should be a Vector3.");
            continue;
        }

        const expectedDirection = obfuscatedRayDirectionCalc(
            x, y, pixelWidth, pixelHalfWidth, eyeDistance
        );
        const actualDirection = [ray.direction.x, ray.direction.y, ray.direction.z];

        if (
            Math.abs(expectedDirection[0] - actualDirection[0]) > 1e-6 ||
            Math.abs(expectedDirection[1] - actualDirection[1]) > 1e-6 ||
            Math.abs(expectedDirection[2] - actualDirection[2]) > 1e-6
        ) {
            logResult(
                `${testName} (Pixel: ${x}, ${y})`,
                false,
                `Ray direction mismatch. Expected ${expectedDirection}, got ${actualDirection}.`
            );
        } else {
            logResult(`${testName} (Pixel: ${x}, ${y})`, true);
        }
    }
}

// Automatically run tests after the page loads
window.onload = runRaytracerTests;
