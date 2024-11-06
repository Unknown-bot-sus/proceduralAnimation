class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    static subtract(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    scale(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setMagnitude(magnitude) {
        const currentMagnitude = this.magnitude();
        if (currentMagnitude === 0) return new Vector(0, 0); // Avoid division by zero
        const scale = magnitude / currentMagnitude;
        return this.scale(scale);
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    heading() {
        const radians = Math.atan2(this.y, this.x);
        return radians >= 0 ? radians : radians + 2 * Math.PI;
    }
}
