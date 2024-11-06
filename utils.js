
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
