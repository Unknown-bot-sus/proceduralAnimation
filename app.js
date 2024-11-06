const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;

const ctx = canvas.getContext('2d');

const origin = new Vector(halfWidth, halfHeight);
const snake = new Snake(origin, ctx);
snake.resolve(Vector.add(origin, new Vector(-60, 0)));

canvas.addEventListener('mousemove', (e) => {
    const boundingRect = canvas.getBoundingClientRect();
    const mousePox = new Vector(e.clientX - boundingRect.left, e.clientY - boundingRect.top)

    snake.resolve(mousePox);
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.display();
    requestAnimationFrame(animate);
}

animate();