// Input.js
// Handles keyboard input for movement and actions in the application.
// Tracks the state of specific keys (arrows, WASD, Q, E, F) and provides
// boolean flags for each. Automatically updates on key events and resets
// on window blur. 

class Input {
    // ----------------------------------------------------------------------
    constructor() {
        this.up = this.down = this.left = this.right =
        this.w  = this.a = this.s = this.d =
        this.q  = this.e = this.f = false;

        // live set of currently‑pressed keys
        this.pressedKeys = new Set();

        // internal table of tracked keys (all lower‑case except arrow names)
        this._tracked = new Set([
            'arrowup','arrowdown','arrowleft','arrowright',
            'w','a','s','d','q','e','f'
        ]);

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp   = this.onKeyUp.bind(this);

        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup',   this.onKeyUp);
        window.addEventListener('blur',    () => this.resetAllKeys());
    }

    // ----------------------------------------------------------------------
    isTrackedKey(key) {
        return this._tracked.has(this.normalizeKey(key));
    }

    // ----------------------------------------------------------------------
    normalizeKey(key) {
        // Arrow keys stay as‑is; letters become lower‑case
        return key.length === 1 ? key.toLowerCase() : key;
    }

    // ----------------------------------------------------------------------
    resetAllKeys() {
        this.pressedKeys.clear();
        this.updateKeyStates();
    }

    // ----------------------------------------------------------------------
    updateKeyStates() {
        // sync boolean mirrors with the Set in one sweep
        const k = this.pressedKeys;
        this.up    = k.has('arrowup');
        this.down  = k.has('arrowdown');
        this.left  = k.has('arrowleft');
        this.right = k.has('arrowright');
        this.w = k.has('w');  this.a = k.has('a');  this.s = k.has('s');  this.d = k.has('d');
        this.q = k.has('q');  this.e = k.has('e');  this.f = k.has('f');
    }

    // ----------------------------------------------------------------------
    onKeyDown(e) {
        const key = this.normalizeKey(e.key);
        if (!this.isTrackedKey(key)) return;

        this.pressedKeys.add(key);
        this.updateKeyStates();
    }

    // ----------------------------------------------------------------------
    onKeyUp(e) {
        const key = this.normalizeKey(e.key);
        if (!this.isTrackedKey(key)) return;

        this.pressedKeys.delete(key);
        this.updateKeyStates();
    }
}
