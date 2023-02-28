
import { manipulatePoint } from "./manipulate-point.service";

import { getPlaneFromThreePoints } from "../logic/get-plane-from-three-points.logic";
import { getPlaneLineIntersection } from "../logic/get-plane-line-intersect.logic";
import { isPointOnLine } from "../logic/is-point-on-line.logic";

import { Point } from "../models/Point.model";
import { Line } from "../models/Line.model";
import { Polygon } from "../models/Polygon.model";

import { RADIANS } from "../data/RADIANS.data";

const getPlanes = function(){
    const topViewPlane = getPlaneFromThreePoints(
        new Point(0,0,0),
        new Point(0,Math.tan(this.aperture.y / RADIANS) * 10,10),
        new Point(10,Math.tan(this.aperture.y / RADIANS) * 10,10),
    );
    const rightViewPlane = getPlaneFromThreePoints(
        new Point(0,0,0),
        new Point(Math.tan(this.aperture.zx / RADIANS) * 10,0,10),
        new Point(Math.tan(this.aperture.zx / RADIANS) * 10,10,10),
    );
    const bottomViewPlane = getPlaneFromThreePoints(
        new Point(0,0,0),
        new Point(0,-Math.tan(this.aperture.y / RADIANS) * 10,10),
        new Point(10,-Math.tan(this.aperture.y / RADIANS) * 10,10),
    );
    const leftViewPlane = getPlaneFromThreePoints(
        new Point(0,0,0),
        new Point(-Math.tan(this.aperture.zx / RADIANS) * 10,0,10),
        new Point(-Math.tan(this.aperture.zx / RADIANS) * 10,10,10),
    );
    return { topViewPlane, rightViewPlane, bottomViewPlane, leftViewPlane };
}





export const render = function(){

    const planes = getPlanes.apply(this);

    const zeroZPlane = getPlaneFromThreePoints(
        new Point(0, 0, 0),
        new Point(10, 0, 0),
        new Point(10, 10, 0),
    );

    const getViewIntercepts = line => {

        const { topViewPlane, rightViewPlane, bottomViewPlane, leftViewPlane } = planes;

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

        return validPlaneIntersects;
    }

    const resolveLine = line => {
        const { start, end } = line;
        const viewIntercepts = getViewIntercepts(line);
        const startDimensions = this.getDimensions(start);
        const endDimensions = this.getDimensions(end);
        if (startDimensions === null && endDimensions === null) {

            // console.log("Smashy smashy: ", viewIntercepts);

            if (viewIntercepts.length === 2) {
                const [start, end] = viewIntercepts;
                return { start: this.getDimensions(start, true), end: this.getDimensions(end, true) };
            }
            return null;
        }
        if (startDimensions !== null && endDimensions !== null) {
            return { start: startDimensions, end: endDimensions };
        }
        const [viewIntercept] = viewIntercepts;
        const last = startDimensions === null ? endDimensions : startDimensions;
        return { start: this.getDimensions(viewIntercept, true), end: last };
        // if (start.z >= 0 && end.z >= 0) {
        //     start = this.getDimensions(start, true);
        //     end = this.getDimensions(end, true);
        //     return { start, end };
        // }
        // else if (start.z < 0 && end.z < 0) {
        //     return null;
        // }
        // else {
        //     const intercept = getPlaneLineIntersection(zeroZPlane, new Line(start, end));
        //     if (start.z < 0) {
        //         end = this.getDimensions(end, true);
        //         start = this.getDimensions(new Point(intercept.x, intercept.y, intercept.z + 0.001), true);
        //     }
        //     else {
        //         start = this.getDimensions(start, true);
        //         end = this.getDimensions(new Point(intercept.x, intercept.y, intercept.z + 0.001), true);
        //     }
        //     return { start, end };
        // }
    }

    

    const resolvePolygonPoints = (points, line) => {
        const { start, end } = line;
        const viewIntercepts = getViewIntercepts(line);
        const startDimensions = this.getDimensions(start);

        // console.log("Data: ", startDimensions, viewIntercepts);

        if (viewIntercepts.length === 0 && startDimensions !== null) {
            points.push(startDimensions);
            return;
        }

        const [viewIntercept] = viewIntercepts;
        const intercept = getPlaneLineIntersection(zeroZPlane, line);

        // console.log("More info: ", start, end, "|", viewIntercept, intercept);

        start.z >= 0 && points.push(
            this.getDimensions(start, true),
            viewIntercept && this.getDimensions(viewIntercept, true)
        );

        points.push(this.getDimensions(new Point(intercept.x, intercept.y, intercept.z + 0.001), true));

        end.z >= 0 && points.push(
            viewIntercept && this.getDimensions(viewIntercept, true),
            this.getDimensions(end, true)
        );

        // console.log("Output points: ", points);

    }

    const points = this.points
        .map(point => {
            const { x, y, z } = manipulatePoint(this.centre, this.direction, point);
            if (z < 0) return null;
            const { width, height } = this.getDimensions(new Point(x, y, z), true);
            return { width, height };
        })
        .filter(point => point !== null);

    const lines = this.lines
        .map(({ start, end, colour }) => new Line(manipulatePoint(this.centre, this.direction, start), manipulatePoint(this.centre, this.direction, end), { colour }))
        .map(line => {
            const resolvedLine = resolveLine(line);
            if (resolvedLine === null) return null;
            const { start, end } = resolvedLine;
            return { start, end, colour: line.colour };
        })
        .filter(line => line !== null);

    // console.log("Polygon: ", this.polygons[0]);

    const polygons = this.polygons
        .map(({ points, colour }) => new Polygon( points.map(x => manipulatePoint(this.centre, this.direction, x)), { colour } ))
        .map(({ points: polygonPoints, colour }) => {
            const points = [];

            // console.log("Points notes: ", polygonPoints);

            polygonPoints.forEach((point, index) => {
                const nextPoint = polygonPoints[index === (polygonPoints.length - 1) ? 0 : (index + 1)];
                const line = new Line(point, nextPoint);
                resolvePolygonPoints(points, line);
            });
            if (points.length < 3) {
                return null;
            }

            // console.log("Points: ", points);

            return { points: points.filter(point => !!point), colour };
        })
        .filter(polygon => polygon !== null);

    return { polygons, lines, points };
}
