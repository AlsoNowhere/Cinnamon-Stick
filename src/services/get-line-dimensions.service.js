
import { getPlaneLineIntersection } from "./get-plane-line-intersect.service";
import { isPointOnLine } from "./is-point-on-line.service";

import { Point } from "../models/Point.model";
import { Line } from "../models/Line.model";

import { RADIANS } from "../data/RADIANS.data";

export const getLineDimensions = function(line, topPlane, rightPlane, bottomPlane, leftPlane) {

    let startDimensions = this.getDimensions(line.start);
    let endDimensions = this.getDimensions(line.end);

    const topIntersect = getPlaneLineIntersection(topPlane, line);
    const rightIntersect = getPlaneLineIntersection(rightPlane, line);
    const bottomIntersect = getPlaneLineIntersection(bottomPlane, line);
    const leftIntersect = getPlaneLineIntersection(leftPlane, line);

    const isTopIntersectValid = topIntersect.valid
        && isPointOnLine(topIntersect, new Line(
            new Point(-Math.tan(this.aperture.zx / RADIANS) * topIntersect.z, topIntersect.y, topIntersect.z),
            new Point(Math.tan(this.aperture.zx / RADIANS) * topIntersect.z, topIntersect.y, topIntersect.z)
        ))
        && isPointOnLine(topIntersect, line);
    const isRightIntersectValid = rightIntersect.valid
        && isPointOnLine(rightIntersect, new Line(
            new Point(rightIntersect.x, -Math.tan(this.aperture.y / RADIANS) * rightIntersect.z, rightIntersect.z),
            new Point(rightIntersect.x, Math.tan(this.aperture.y / RADIANS) * rightIntersect.z, rightIntersect.z)
        ))
        && isPointOnLine(rightIntersect, line);
    const isBottomIntersectValid = bottomIntersect.valid
        && isPointOnLine(bottomIntersect, new Line(
            new Point(-Math.tan(this.aperture.zx / RADIANS) * bottomIntersect.z, bottomIntersect.y, bottomIntersect.z),
            new Point(Math.tan(this.aperture.zx / RADIANS) * bottomIntersect.z, bottomIntersect.y, bottomIntersect.z)
        ))
        && isPointOnLine(bottomIntersect, line);
    const isLeftIntersectValid = leftIntersect.valid
        && isPointOnLine(leftIntersect, new Line(
            new Point(leftIntersect.x, -Math.tan(this.aperture.y / RADIANS) * leftIntersect.z, leftIntersect.z),
            new Point(leftIntersect.x, Math.tan(this.aperture.y / RADIANS) * leftIntersect.z, leftIntersect.z)
        ))
        && isPointOnLine(leftIntersect, line);

    const validPlaneIntersects = [
        [topIntersect, isTopIntersectValid],
        [rightIntersect, isRightIntersectValid],
        [bottomIntersect, isBottomIntersectValid],
        [leftIntersect, isLeftIntersectValid]
    ].reduce((a, b) => {
        const [intersect, valid] = b;
        if (valid) {
            a.push(intersect);
        }
        return a;
    }, []);

    const metaData = {
        both: false,
        start: false,
        end: false
    };

    if (startDimensions === null
        && endDimensions === null) {

        if (validPlaneIntersects.length === 2) {
            const dimensionsStart = this.getDimensions(validPlaneIntersects[0], true);
            const dimensionsEnd = this.getDimensions(validPlaneIntersects[1], true);
            startDimensions = dimensionsStart;
            endDimensions = dimensionsEnd;
            if (startDimensions === null
                || endDimensions === null) {
                return null;
            }
            metaData.both = true;
        }
        else {
            return null;
        }
    }

    if (startDimensions === null) {
        if (validPlaneIntersects.length === 1) {
            const dimensions = this.getDimensions(validPlaneIntersects[0], true);
            if (dimensions === null) {
                return null;
            }
            startDimensions = dimensions;
            metaData.start = true;
        }
        else {
            return null;
        }
    }

    if (endDimensions === null) {
        if (validPlaneIntersects.length === 1) {
            const dimensions = this.getDimensions(validPlaneIntersects[0], true);
            if (dimensions === null) {
                return null;
            }
            endDimensions = dimensions;
            metaData.end = true;
        }
        else {
            return null;
        }
    }

    return { startDimensions, endDimensions, metaData };
}
