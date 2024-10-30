class Chain {
    constructor(originPos, joinCount, linkSize) {
        if (joinCount < 1) {
            throw new Error('Join count must be greater than 1');
        }

        this.joints = new Array(joinCount).fill(null);
        this.joints[0] = originPos;
        this.angels = [];
        this.linkSize = linkSize;

        for (let i = 1; i < joinCount; i++) {
            this.joints[i] = {
                x: this.joints[i - 1].x + this.linkSize,
                y: this.joints[i - 1].y
            };
        }
    }

    display() {
        for (const joint of this.joints) {
            ctx.beginPath();
            ctx.arc(joint.x, joint.y, this.linkSize, 0, Math.PI * 2);
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
const origin = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

const chain = new Chain(origin, 5, 25);

canvas.addEventListener('mousemove', (e) => {
    const boundingRect = canvas.getBoundingClientRect();

    const mousePox = {
        x: e.clientX - boundingRect.left,
        y: e.clientY - boundingRect.top
    }

    chain.resolve(mousePox);
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chain.display();
    requestAnimationFrame(animate);
}

animate();
