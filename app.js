const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;

const origin = new Vector(halfWidth, halfHeight);

const objects = [
    new Chain(origin, 30, 20, ctx),
    new Debug(origin, ctx),
    new Snake(origin, ctx),
]

let i = 0;

function getIndex() {
    return (i++) % objects.length;
}

let creature = objects[getIndex()];

canvas.addEventListener('mousemove', (e) => {
    const boundingRect = canvas.getBoundingClientRect();
    const mousePox = new Vector(e.clientX - boundingRect.left, e.clientY - boundingRect.top)

    creature.resolve(mousePox);
});

canvas.addEventListener('click', (e) => {
    const prev = creature;
    creature = objects[getIndex()];

    if (prev instanceof Chain) {
        creature.spine = prev;
    } else if (creature instanceof Chain) {
        creature.joints = prev.spine.joints;
        creature.angles = prev.spine.angles;
    } else if (creature instanceof Snake) {
        creature.spine = prev.spine;
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    creature.display();
    requestAnimationFrame(animate);
}


animate();