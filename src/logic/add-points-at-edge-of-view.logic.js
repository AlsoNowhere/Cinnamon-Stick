
import { getDistance3D } from "./get-distance.logic";
import { getPlaneLineIntersection } from "./get-plane-line-intersect.logic";
import { isPointOnLine } from "./is-point-on-line.logic";

export const addPointsAtEdgeOfView = function(
    points,
    line,
    { topViewPlane, rightViewPlane, bottomViewPlane, leftViewPlane }
){

    const topIntersect = getPlaneLineIntersection(topViewPlane, line);
    const rightIntersect = getPlaneLineIntersection(rightViewPlane, line);
    const bottomIntersect = getPlaneLineIntersection(bottomViewPlane, line);
    const leftIntersect = getPlaneLineIntersection(leftViewPlane, line);

    const isTopOnLine = isPointOnLine(topIntersect, line);
    const isRightOnLine = isPointOnLine(rightIntersect, line);
    const isBottomOnLine = isPointOnLine(bottomIntersect, line);
    const isLeftOnLine = isPointOnLine(leftIntersect, line);

    const intercepts = [];

    if (isTopOnLine && topIntersect.z >= 0) {
        intercepts.push({ point: topIntersect, dimensions: this.getDimensions(topIntersect), name: "top" });
    }
    if (isBottomOnLine && bottomIntersect.z >= 0) {
        intercepts.push({ point: bottomIntersect, dimensions: this.getDimensions(bottomIntersect), name: "bottom" });
    }
    if (isRightOnLine) {
        if (rightIntersect.z >= 0) {
            intercepts.push({ point: rightIntersect, dimensions: this.getDimensions(rightIntersect, true), name: "right" });
        }
        else {
            intercepts.push({ point: rightIntersect, dimensions: { width: 0, height: rightIntersect.y > 0 ? 0 : this.height }, name: "right"});
        }
    }
    if (isLeftOnLine) {
        if (leftIntersect.z >= 0) {
            intercepts.push({ point: leftIntersect, dimensions: this.getDimensions(leftIntersect, true), name: "left" });
        }
        else {
            intercepts.push({ point: leftIntersect, dimensions: { width: this.width, height: leftIntersect.y > 0 ? 0 : this.height }, name: "left"});
        }
    }

    // console.log("Plane intercepts: ", intercepts);

    points.push(
        ...intercepts
            .filter(({ dimensions }) => !!dimensions)
            .sort((a, b) => getDistance3D(line.start, a.point) - getDistance3D(line.start, b.point))
            .map(({ dimensions }) => dimensions)
    );



    // console.log("NM: ",
    //     // line.start,
    //     // line.end,
    //     leftIntersect,
    //     rightIntersect,
    //     isLeftOnLine,
    //     isRightOnLine,
    //     "|",
    //     // line.start.x < line.end.x
    // );

    // let leftPoint = null;
    // let rightPoint = null;

    // if (isLeftOnLine) {
    //     const width = leftIntersect.z > 0 ? 0 : this.width;
    //     const height = leftIntersect.y < 0 ? this.height : 0;
    //     // leftPoint = { width, height };
    //     intercepts.push({ width, height });
    // }
    // if (isRightOnLine) {
    //     const width = rightIntersect.z > 0 ? this.width : 0;
    //     const height = rightIntersect.y < 0 ? this.height : 0;
    //     // rightPoint = { width, height };
    //     intercepts.push({ width, height });
    // }

    // if (
    //     getDistance3D(line.start, leftIntersect) <= getDistance3D(line.start, rightIntersect)
    //     // leftIntersect.x < rightIntersect.x
    // ) {
    //     leftPoint !== null && points.push(leftPoint);
    //     rightPoint !== null && points.push(rightPoint);
    // }
    // else {
    //     rightPoint !== null && points.push(rightPoint);
    //     leftPoint !== null && points.push(leftPoint);
    // }

}
