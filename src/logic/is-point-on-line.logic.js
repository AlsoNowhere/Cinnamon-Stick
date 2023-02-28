
/*
    Does not check is point completes the line equation, it assumes that it does.
    Checks if the point is between the start and end.

    --start-------POINT-------end--
    The above would return true.

    --POINT----start-------end--
    The above would return false.
*/

import { getDistance3D } from "./get-distance.logic"

export const isPointOnLine = (point, line) => {
    const distanceToStart = getDistance3D(point, line.start);
    const distanceToEnd = getDistance3D(point, line.end);

    return distanceToStart < line.distance && distanceToEnd < line.distance;
}
