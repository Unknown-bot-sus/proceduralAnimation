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
