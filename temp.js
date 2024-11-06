function constrainDistance(pos, anchor, constraint) {
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

const p1 = { x: 0, y: 0 };
const p2 = { x: 15, y: 0 };

// console.log(
//     constrainDistance(p1, p2, 20),
// )

let bodyWidth = 10;
let angle = 90;
let x = 0;
console.log(0 + Math.cos(angle + Math.PI / 2) * bodyWidth)