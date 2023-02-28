
import { getDistance2D } from "../logic/get-distance.logic";

import { Point } from "../models/Point.model";

import { RADIANS } from "../data/RADIANS.data";

const getAngle = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const angle = Math.atan(dx / dy) * RADIANS;
    return angle;
}

const getXY = (angle, distance) => {
    const x = Math.sin(angle / RADIANS) * distance;
    const y = Math.cos(angle / RADIANS) * distance;
    return { x, y }
}

export const manipulatePoint = (
    centre,
    direction,
    { x, y, z }
) => {

    // console.log("Start Wand: ", x, y, z, centre);

    x -= centre.x;
    y -= centre.y;
    z -= centre.z;


    {
        const point2D = { x, y: z };
        let angle = getAngle({ x: 0, y: 0 }, point2D);
        if (x < 0 && z < 0) angle = -180 + angle;
        if (x > 0 && z < 0) angle = 180 + angle;
        angle = angle - (direction.zx > 180 ? direction.zx - 360 : direction.zx);
        const distance2D = getDistance2D({ x: 0, y: 0 }, point2D);
        const { x: newX, y: newZ } = getXY(angle, distance2D);

        // console.log("Middle kingdon: ", x, z, "|||", newX, newZ, "|", point2D, "||", angle, getAngle({ x: 0, y: 0 }, point2D));

        x = newX;
        z = newZ;
    }
    {
        const point2D = { x: z, y };
        let angle = getAngle({ x: 0, y: 0 }, point2D);
        if (z > 0 && y < 0) angle += 180;
        if (z < 0 && y < 0) angle = -180 + angle;
        angle = angle - direction.y;
        const distance2D = getDistance2D({ x: 0, y: 0 }, point2D);
        const { x: newZ, y: newY } = getXY(angle, distance2D);
        z = newZ;
        y = newY;
    }

    // console.log("End Wand: ", x, y, z);





    // {
    //     const distance2D = getDistance2D({ x: 0, y: 0 }, { x, y: z });
    //     const angle = getAngle({ x: 0, y: 0 }, { x, y: z });
    //     const newAngle = angle - (direction.zx > 180 ? direction.zx - 360 : direction.zx);
    //     const { x: _x, y: _y } = getXY(newAngle, distance2D);
    //     if (z < 0) {
    //         x = -_x;
    //     }
    //     else {
    //         x = _x;
    //     }
    //     if (z > -0.0000001) {
    //         z = _y;
    //     }
    //     else {
    //         z = -_y;
    //     }
    // }





    // {
    //     const distance2D = getDistance2D({ x: 0, y: 0 }, { x: z, y });
    //     let angle = getAngle({ x: 0 , y: 0 }, { x: z , y });
    //     angle < 0 && (angle = 180 + angle);
    //     const newAngle = angle - direction.y;
    //     const { x: _x, y: _y } = getXY(newAngle, distance2D);
    //     z = _x * (z < 0 ? -1 : 1);
    //     y = _y * (z < 0 ? -1 : 1);
    // }








    return new Point(x, y, z);
}
