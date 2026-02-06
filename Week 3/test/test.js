class TestReporter {
    constructor() {
        this.totalNumberOfTests = 0;
        this.numberOfTestsPassed = 0;
        this.currentTestRow = null;
        this.table = null;
        this.container = null;
        this.createBaseStructure();
    }

    //---------------------------------------------------------------------------
    createBaseStructure() {
        // Ensure the container exists
        this.container = document.querySelector('.test-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'test-container';
            document.body.appendChild(this.container);
        }

        // Create a table for the tests
        this.table = document.createElement('table');
        this.table.className = 'test-table';

        // Create table body
        const tbody = document.createElement('tbody');
        this.table.appendChild(tbody);

        this.container.appendChild(this.table);
    }

    //---------------------------------------------------------------------------
    reportSectionHeader(message) {
        const tbody = this.table.querySelector('tbody');
        const row = document.createElement('tr');
        const cell = document.createElement('th');
        cell.colSpan = 2;
        cell.className = 'section-header';
        cell.textContent = message;
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    //---------------------------------------------------------------------------
    reportTestStart(testName) {
        // Create a new row for each test
        const tbody = this.table.querySelector('tbody');
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const resultCell = document.createElement('td');

        nameCell.textContent = testName;
        resultCell.textContent = '...';

        row.appendChild(nameCell);
        row.appendChild(resultCell);
        tbody.appendChild(row);

        // Keep track of the current row's result cell
        this.currentTestRow = { row, nameCell, resultCell };
    }

    //---------------------------------------------------------------------------
    reportTestEnd(result) {
        // Update the current test row with the result
        if (this.currentTestRow) {
            this.currentTestRow.resultCell.textContent = result ? 'Passed' : 'Failed';
            this.currentTestRow.resultCell.className = result ? 'passed' : 'failed';
        }

        this.totalNumberOfTests += 1;
        if (result) this.numberOfTestsPassed += 1;
    }

    //---------------------------------------------------------------------------
    reportText(message) {
        // If you need additional text output, you can insert it as a row, or skip this entirely
        const tbody = this.table.querySelector('tbody');
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 2;
        cell.textContent = message;
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    //---------------------------------------------------------------------------
    reportFinalResults() {
        const finalDiv = document.createElement('div');
        finalDiv.className = 'final-results';

        const h1 = document.createElement('h1');
        h1.textContent = `Passed ${this.numberOfTestsPassed} tests out of ${this.totalNumberOfTests}`;
        finalDiv.appendChild(h1);

        if (this.numberOfTestsPassed === this.totalNumberOfTests && this.totalNumberOfTests > 0) {
            const img = document.createElement('img');
            img.src = 'https://pa1.narvii.com/6260/660b0520475efbfdd51bd3c0168524837462ff1b_hq.gif';
            img.alt = 'All tests passed!';
            finalDiv.appendChild(img);
        }

        this.container.appendChild(finalDiv);
    }
}

// ######################  COMPARISON FUNCTIONS ##############################

const FLOAT32_EPSILON = 1.1920928955078125e-5;

function computeEpsilon(a, b) {
    const absA = Math.abs(a);
    const absB = Math.abs(b);
    const maxAbs = Math.max(absA, absB);
    return maxAbs === 0 ? Number.EPSILON : Number.EPSILON * maxAbs;
}

function floatEqual(f1, f2) {
    const epsilon = computeEpsilon(f1, f2);
    return Math.abs(f1 - f2) < epsilon;
}

function vectorEqual(arg1, arg2, arg3, arg4) {
    function floatEqualLocal(a, b) {
        const epsilon = computeEpsilon(a, b);
        return Math.abs(a - b) <= epsilon;
    }

    if (!arg1 || (arg2 === undefined && typeof arg2 !== 'number')) {
        throw new Error('Invalid arguments passed to vectorEqual.');
    }

    if (arg2 instanceof Vector3) {
        return floatEqualLocal(arg1.x, arg2.x) &&
               floatEqualLocal(arg1.y, arg2.y) &&
               floatEqualLocal(arg1.z, arg2.z);
    } else {
        if (typeof arg2 !== 'number' || typeof arg3 !== 'number' || typeof arg4 !== 'number') {
            throw new Error('Invalid components passed to vectorEqual.');
        }

        return floatEqualLocal(arg1.x, arg2) &&
               floatEqualLocal(arg1.y, arg3) &&
               floatEqualLocal(arg1.z, arg4);
    }
}

function matrix3Equal(m1, m2) {
    if (!m1 || !m2 || !m1.elements || !m2.elements) {
        throw new Error('Invalid matrices passed to matrix3Equal.');
    }

    for (let i = 0; i < 9; ++i) {
        if (!floatEqual(m1.elements[i], m2.elements[i])) {
            return false;
        }
    }
    return true;
}

function matrix4Equal(m1, m2) {
    if (!m1 || !m2 || !m1.elements || !m2.elements) {
        throw new Error('Invalid matrices passed to matrix4Equal.');
    }

    for (let i = 0; i < 16; ++i) {
        if (!floatEqual(m1.elements[i], m2.elements[i])) {
            return false;
        }
    }
    return true;
}

function sphereEqual(sphere, x, y, z, radius) {
    if (!sphere || !sphere.center) {
        throw new Error('Invalid sphere passed to sphereEqual.');
    }

    return floatEqual(sphere.center.x, x) &&
           floatEqual(sphere.center.y, y) &&
           floatEqual(sphere.center.z, z) &&
           floatEqual(sphere.radius, radius);
}

function assert(condition, testName) {
    if (!condition) {
        throw new Error(`Test "${testName}" failed.`);
    }
}
