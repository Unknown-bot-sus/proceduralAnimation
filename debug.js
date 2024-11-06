class Debug extends Snake {
    constructor(origin, ctx) {
        super(origin, ctx);

        this.origin = origin;
        this.ctx = ctx;
    }

    display() {
        const ctx = this.ctx;
        this.spine.display();
        ctx.fillStyle = 'red';

        const angleOffset = Math.PI / 2;
        for (let i = 0; i < this.spine.joints.length; i++) {
            ctx.beginPath();
            ctx.arc(this.getPosX(i, angleOffset, 0), this.getPosY(i, angleOffset, 0), 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.getPosX(i, -angleOffset, 0), this.getPosY(i, -angleOffset, 0), 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            const joint = this.spine.joints[i];
            ctx.arc(joint.x, joint.y, this.bodyWidth(i), 0, Math.PI * 2);
            ctx.stroke();

        }
    }
}