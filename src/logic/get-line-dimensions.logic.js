
import { getPlaneLineIntersection } from "./get-plane-line-intersect.logic";
import { isPointOnLine } from "./is-point-on-line.logic";

import { Point } from "../models/Point.model";
import { Line } from "../models/Line.model";

import { RADIANS } from "../data/RADIANS.data";

export const getLineDimensions = function(
    line,
    topViewPlane,
    rightViewPlane,
    bottomViewPlane,
    leftViewPlane
) {

    let startDimensions = this.getDimensions(line.start);
    let endDimensions = this.getDimensions(line.end);

    // console.log("Start end: ", startDimensions, endDimensions);

    const topIntersect = getPlaneLineIntersection(topViewPlane, line);
    const rightIntersect = getPlaneLineIntersection(rightViewPlane, line);
    const bottomIntersect = getPlaneLineIntersection(bottomViewPlane, line);
    const leftIntersect = getPlaneLineIntersection(leftViewPlane, line);

    const isTopIntersectValid = topIntersect.valid
        && isPointOnLine(topIntersect, new Line(
            new Point(-Math.tan(this.aperture.zx / RADIANS) * topIntersect.z, topIntersect.y, topIntersect.z),
            new Point(Math.tan(this.aperture.zx / RADIANS) * topIntersect.z, topIntersect.y, topIntersect.z)
        ))
        && isPointOnLine(topIntersect, line)
        && topIntersect.z >= 0;
    const isRightIntersectValid = rightIntersect.valid
        && isPointOnLine(rightIntersect, new Line(
            new Point(rightIntersect.x, -Math.tan(this.aperture.y / RADIANS) * rightIntersect.z, rightIntersect.z),
            new Point(rightIntersect.x, Math.tan(this.aperture.y / RADIANS) * rightIntersect.z, rightIntersect.z)
        ))
        && isPointOnLine(rightIntersect, line)
        && rightIntersect.z >= 0;
    const isBottomIntersectValid = bottomIntersect.valid
        && isPointOnLine(bottomIntersect, new Line(
            new Point(-Math.tan(this.aperture.zx / RADIANS) * bottomIntersect.z, bottomIntersect.y, bottomIntersect.z),
            new Point(Math.tan(this.aperture.zx / RADIANS) * bottomIntersect.z, bottomIntersect.y, bottomIntersect.z)
        ))
        && isPointOnLine(bottomIntersect, line)
        && bottomIntersect.z >= 0;
    const isLeftIntersectValid = leftIntersect.valid
        && isPointOnLine(leftIntersect, new Line(
            new Point(leftIntersect.x, -Math.tan(this.aperture.y / RADIANS) * leftIntersect.z, leftIntersect.z),
            new Point(leftIntersect.x, Math.tan(this.aperture.y / RADIANS) * leftIntersect.z, leftIntersect.z)
        ))
        && isPointOnLine(leftIntersect, line)
        && leftIntersect.z >= 0;

    const { validPlaneIntersects, intersects } = [
        [topIntersect, isTopIntersectValid, "top"],
        [rightIntersect, isRightIntersectValid, "right"],
        [bottomIntersect, isBottomIntersectValid, "bottom"],
        [leftIntersect, isLeftIntersectValid, "left"]
    ].reduce((a, [intersect, valid, label]) => {
        if (valid) {
            a.validPlaneIntersects.push(intersect);
            a.intersects.push(label);
        }
        return a;
    }, { validPlaneIntersects: [], intersects: [] });

    const metaData = {
        both: false,
        start: false,
        end: false
    };

    // console.log("Focus on right: ", validPlaneIntersects, intersects, leftIntersect);

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
