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
            this.angles[i] = constrainAngle(curAngle, this.angles[i - 1], Math.PI * 2);
            this.joints[i] = constrainDistance(this.joints[i], this.joints[i - 1], this.linkSize);
        }
    }
}
