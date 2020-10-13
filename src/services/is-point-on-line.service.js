
/*
    Does not check is point completes the line equation, it assumes that it does.
    Checks if the point is between the start and end.

    --start-------point-------end--
    The above would return true.

    --point----start-------end--
    The above would return false.
*/

import { getDistance } from "./get-distance.service"

export const isPointOnLine = (point, line) => {
    const distanceToStart = getDistance(point, line.start);
    const distanceToEnd = getDistance(point, line.end);

    return distanceToStart < line.distance && distanceToEnd < line.distance;
}
