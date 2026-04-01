/* An absurdly basic input implementation - written to be maximally easy to understand */
class Input {
    // --------------------------------------------------------------------------
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.a = false;
        this.s = false;
        this.d = false;
        this.w = false;
        this.f = false;

        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    // --------------------------------------------------------------------------
    onKeyUp(e) {
        if (e.key === "ArrowUp") { this.up = false; }
        if (e.key === "ArrowDown") { this.down = false; }
        if (e.key === "ArrowLeft") { this.left = false; }
        if (e.key === "ArrowRight") { this.right = false; }
        if (e.key === "a") { this.a = false; }
        if (e.key === "s") { this.s = false; }
        if (e.key === "d") { this.d = false; }
        if (e.key === "f") { this.f = false; }
        if (e.key === "w") { this.w = false; }
    }

    // --------------------------------------------------------------------------
    onKeyDown(e) {
        if (e.key === "ArrowUp") { this.up = true; }
        if (e.key === "ArrowDown") { this.down = true; }
        if (e.key === "ArrowLeft") { this.left = true; }
        if (e.key === "ArrowRight") { this.right = true; }
        if (e.key === "a") { this.a = true; }
        if (e.key === "s") { this.s = true; }
        if (e.key === "d") { this.d = true; }
        if (e.key === "f") { this.f = true; }
        if (e.key === "w") { this.w = true; }
    }
}

