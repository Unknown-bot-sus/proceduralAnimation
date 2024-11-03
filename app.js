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

function constrainDistance(pos, anchor, constraint) {
    return Vector.add(anchor, Vector.subtract(pos, anchor).setMagnitude(constraint));
}

// Constrain the angle to be within a certain range of the anchor
function constrainAngle(angle, anchor, constraint) {
    if (Math.abs(relativeAngleDiff(angle, anchor)) <= constraint) {
        return simplifyAngle(angle);
    }

    if (relativeAngleDiff(angle, anchor) > constraint) {
        return simplifyAngle(anchor - constraint);
    }

    return simplifyAngle(anchor + constraint);
}

// How many radians do you need to turn the angle to match the anchor?
function relativeAngleDiff(angle, anchor) {
    // Rotate the coordinate space such that PI is at the anchor
    angle = simplifyAngle(angle + Math.PI - anchor);
    anchor = Math.PI;

    return anchor - angle;
}

// Simplify the angle to be in the range [0, 2 * Math.PI)
function simplifyAngle(angle) {
    const TWO_PI = 2 * Math.PI;
    while (angle >= TWO_PI) {
        angle -= TWO_PI;
    }

    while (angle < 0) {
        angle += TWO_PI;
    }

    return angle;
}


class Chain {
    constructor(originPos, joinCount, linkSize, ctx, style = {
        chain: {
            lineWidth: 5,
            color: "black",
        },
        joint: {
            color: 'red',
            lineWidth: 1,
        }
    }) {
        if (joinCount < 1) {
            throw new Error('Join count must be greater than 1');
        }

        this.style = style;
        this.angles = [];
        this.linkSize = linkSize;
        this.ctx = ctx;
        this.angles = new Array(joinCount).fill(0);
        this.joints = new Array(joinCount).fill(null).map((_, i) => new Vector(originPos.x + (i * linkSize), originPos.y));
    }

    display() {
        const ctx = this.ctx;
        const linkStyle = this.style.chain;
        ctx.lineWidth = linkStyle.lineWidth;
        // drawing the line link
        ctx.beginPath();
        ctx.moveTo(this.joints[0].x, this.joints[0].y);
        for (let i = 1; i < this.joints.length; i++) {
            ctx.lineTo(this.joints[i].x, this.joints[i].y);
        }
        ctx.stroke();


        // drawing the joints
        const jointStyle = this.style.joint;
        ctx.fillStyle = jointStyle.color;
        ctx.lineWidth = jointStyle.lineWidth;
        for (const joint of this.joints) {
            ctx.beginPath();
            ctx.arc(joint.x, joint.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

    }

    resolve(pos) {
        this.angles[0] = Vector.subtract(pos, this.joints[0]).heading();
        this.joints[0] = { ...pos };
        for (let i = 1; i < this.joints.length; i++) {
            const curAngle = Vector.subtract(this.joints[i - 1], this.joints[i]).heading();
            this.angles[i] = curAngle;
            this.joints[i] = constrainDistance(this.joints[i], this.joints[i - 1], this.linkSize);
        }
    }
}

class Snake {
    constructor(originPos, ctx) {
        this.spine = new Chain(originPos, 30, 20, ctx);
    }

    display() {
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'rgb(172, 57, 49)';

        // === START BODY ===
        ctx.beginPath();

        // Right half of the snake
        ctx.moveTo(this.getPosX(0, Math.PI / 2, 0), this.getPosY(0, Math.PI / 2, 0));
        for (let i = 1; i < this.spine.joints.length; i++) {
            const cpX = (this.getPosX(i - 1, Math.PI / 2, 0) + this.getPosX(i, Math.PI / 2, 0)) / 2;
            const cpY = (this.getPosY(i - 1, Math.PI / 2, 0) + this.getPosY(i, Math.PI / 2, 0)) / 2;
            ctx.quadraticCurveTo(cpX, cpY, this.getPosX(i, Math.PI / 2, 0), this.getPosY(i, Math.PI / 2, 0));
        }

        ctx.lineTo(this.getPosX(this.spine.joints.length - 1, Math.PI, 0), this.getPosY(this.spine.joints.length - 1, Math.PI, 0));

        // Left half of the snake
        for (let i = this.spine.joints.length - 1; i >= 1; i--) {
            const cpX = (this.getPosX(i, -Math.PI / 2, 0) + this.getPosX(i - 1, -Math.PI / 2, 0)) / 2;
            const cpY = (this.getPosY(i, -Math.PI / 2, 0) + this.getPosY(i - 1, -Math.PI / 2, 0)) / 2;
            ctx.quadraticCurveTo(cpX, cpY, this.getPosX(i - 1, -Math.PI / 2, 0), this.getPosY(i - 1, -Math.PI / 2, 0));
        }

        // Top of the head (completes the loop)
        ctx.quadraticCurveTo(
            this.getPosX(0, -Math.PI / 6, 0), this.getPosY(0, -Math.PI / 6, 0),
            this.getPosX(0, 0, 0), this.getPosY(0, 0, 0)
        );
        ctx.quadraticCurveTo(
            this.getPosX(0, 0, 0), this.getPosY(0, 0, 0),
            this.getPosX(0, Math.PI / 6, 0), this.getPosY(0, Math.PI / 6, 0)
        );

        // Some overlap needed because curveVertex requires extra vertices that are not rendered
        ctx.quadraticCurveTo(
            this.getPosX(0, Math.PI / 2, 0), this.getPosY(0, Math.PI / 2, 0),
            this.getPosX(1, Math.PI / 2, 0), this.getPosY(1, Math.PI / 2, 0)
        );
        ctx.quadraticCurveTo(
            this.getPosX(1, Math.PI / 2, 0), this.getPosY(1, Math.PI / 2, 0),
            this.getPosX(2, Math.PI / 2, 0), this.getPosY(2, Math.PI / 2, 0)
        );

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // === END BODY ===

        // === START EYES ===
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.getPosX(0, Math.PI / 2, -18), this.getPosY(0, Math.PI / 2, -18), 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.getPosX(0, -Math.PI / 2, -18), this.getPosY(0, -Math.PI / 2, -18), 12, 0, Math.PI * 2);
        ctx.fill();
        // === END EYES ===
    }

    displayDebug() {
        this.spine.display();

        ctx.fillStyle = 'red';

        const angleOffset = Math.PI / 2;
        const bodyWidth = 30
        for (let i = 0; i < this.spine.joints.length; i++) {
            ctx.beginPath();
            const x = this.getPosX(i, angleOffset, 0);
            const y = this.getPosY(i, angleOffset, 0);
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            const joint = this.spine.joints[i];
            ctx.arc(joint.x, joint.y, this.bodyWidth(i), 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    getPosX(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].x + Math.cos(this.spine.angles[i] + angleOffset) * (this.bodyWidth(i) + lengthOffset)

    }


    getPosY(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].y + Math.sin(this.spine.angles[i] + angleOffset) * (this.bodyWidth(i) + lengthOffset);
    }

    bodyWidth(i) {
        switch (i) {
            case 0:
                return 34;
            case 1:
                return 36;
            default:
                return 30 - 1;
        }
    }

    resolve(pos) {
        const headPos = this.spine.joints[0];
        const targetPos = constrainDistance(headPos, pos, 10)
        this.spine.resolve(targetPos);
    }
}

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const origin = new Vector(canvas.width / 2, canvas.height / 2);
const snake = new Snake(origin, ctx);

canvas.addEventListener('mousemove', (e) => {
    const boundingRect = canvas.getBoundingClientRect();

    const mousePox = new Vector(e.clientX - boundingRect.left, e.clientY - boundingRect.top)

    snake.resolve(mousePox);
    spine.resolve(mousePox);
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.display();
    requestAnimationFrame(animate);
}

canvas.addEventListener('click', () => {
    console.log(spine.angles);
})

animate();

const spine = new Chain(new Vector(canvas.width / 2, canvas.height / 2), 10, 20, ctx);
function debug() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spine.display();
    const bodyWidth = 36;

    for (let i = 0; i < spine.joints.length; i++) {
        // Begin a new path for the main circle
        ctx.beginPath();
        const x = spine.joints[i].x;
        const y = spine.joints[i].y;

        const dir = spine.angles[i]
        const angleOffset = Math.PI / 2;
        const x2 = x + (Math.cos(dir + angleOffset)) * bodyWidth;
        const y2 = y + (Math.sin(dir + angleOffset)) * bodyWidth;
        ctx.beginPath();
        ctx.arc(x2, y2, 3, 0, Math.PI * 2);
        ctx.fill();
    }


    requestAnimationFrame(debug);
}
