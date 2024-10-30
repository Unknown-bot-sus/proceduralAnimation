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
}

class Chain {
    constructor(originPos, joinCount, linkSize, ctx) {
        if (joinCount < 1) {
            throw new Error('Join count must be greater than 1');
        }

        this.angels = [];
        this.linkSize = linkSize;
        this.ctx = ctx;
        this.joints = new Array(joinCount).fill(null).map((_, i) => new Vector(originPos.x + (i * linkSize), originPos.y));
    }

    display() {
        const ctx = this.ctx;
        // drawing the line link
        for (let i = 1; i < this.joints.length; i++) {
            ctx.beginPath();
            ctx.moveTo(this.joints[i - 1].x, this.joints[i - 1].y);
            ctx.lineTo(this.joints[i].x, this.joints[i].y);
            ctx.stroke();
        }

        // drawing the joints
        for (const joint of this.joints) {
            ctx.beginPath();
            ctx.arc(joint.x, joint.y, 1, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    resolve(pos) {
        this.joints[0] = { ...pos };

        for (let i = 1; i < this.joints.length; i++) {
            this.joints[i] = this.constrainDistance(this.joints[i], this.joints[i - 1], this.linkSize);
        }
    }

    constrainDistance(pos, anchor, constraint) {
        // Calculate the difference vector from anchor to pos
        const dx = pos.x - anchor.x;
        const dy = pos.y - anchor.y;

        // Calculate the current distance
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Scale the vector to the specified constraint distance
        const scale = constraint / distance;

        return {
            x: anchor.x + dx * scale,
            y: anchor.y + dy * scale,
        };
    }

}


const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const origin = new Vector(canvas.width / 2, canvas.height / 2);
const chain = new Chain(origin, 5, 25, ctx);

canvas.addEventListener('mousemove', (e) => {
    const boundingRect = canvas.getBoundingClientRect();

    const mousePox = new Vector(e.clientX - boundingRect.left, e.clientY - boundingRect.top)

    chain.resolve(mousePox);
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chain.display();
    requestAnimationFrame(animate);
}

animate();
