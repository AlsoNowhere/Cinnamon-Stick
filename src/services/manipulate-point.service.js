
import { getDistance2D } from "./get-distance.service";

import { Point } from "../models/Point.model";

import { RADIANS } from "../data/RADIANS.data";

const getAngle = (a,b) => {
    const dx = b.x-a.x;
    const dy = b.y-a.y;
    const angle = Math.atan(dx/dy) * RADIANS;
    return angle;
}

const getXY = (angle,distance) => {

    const x = Math.sin(angle / RADIANS) * distance;
    const y = Math.cos(angle / RADIANS) * distance;

    return {
        x,
        y
    }
}

export const manipulatePoint = (centre, direction, point) => {
    let x = point.x - centre.x;
    let y = point.y - centre.y;
    let z = point.z - centre.z;

    {
        const distance = getDistance2D({x:0,y:0},{x,y:z});
        const angle = getAngle({x:0,y:0},{x,y:z});
        const newAngle = angle - (direction.zx > 180 ? direction.zx - 360 : direction.zx);
        const {x:_x,y:_y} = getXY(newAngle,distance);
        if (z < 0) {
            x = -_x;
        }
        else {
            x = _x;
        }
        if (z > -0.001) {
            z = _y;
        }
        else {
            z = -_y;
        }
    }
    {
        const distance = getDistance2D({x:0,y:0},{x:z,y});
        let angle = getAngle({x:0,y:0},{x:z,y});
        angle < 0 && (angle = 180 + angle);
        const newAngle = angle - direction.y;
        const {x:_x,y:_y} = getXY(newAngle,distance);
        z = _x * (z < 0 ? -1 : 1);
        y = _y * (z < 0 ? -1 : 1);
    }

    return new Point(x, y, z);
}
