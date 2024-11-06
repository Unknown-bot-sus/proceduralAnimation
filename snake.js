class Snake {
    constructor(originPos, ctx) {
        this.spine = new Chain(originPos, 30, 20, ctx);
    }

    display() {
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'black';
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