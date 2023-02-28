
import { manipulatePoint } from "./manipulate-point.service";

import { getPlaneFromThreePoints } from "../logic/get-plane-from-three-points.logic";
import { getPlaneLineIntersection } from "../logic/get-plane-line-intersect.logic";

import { Point } from "../models/Point.model";
import { Line } from "../models/Line.model";
import { Polygon } from "../models/Polygon.model";

export const render = function(){

    const zeroZPlane = getPlaneFromThreePoints(
        new Point(0, 0, 0),
        new Point(10, 0, 0),
        new Point(10, 10, 0),
    );

    const resolveLine = ({ start, end }) => {
        if (start.z >= 0 && end.z >= 0) {
            start = this.getDimensions(start, true);
            end = this.getDimensions(end, true);
            return { start, end };
        }
        else if (start.z < 0 && end.z < 0) {
            return null;
        }
        else {
            const intercept = getPlaneLineIntersection(zeroZPlane, new Line(start, end));
            if (start.z < 0) {
                end = this.getDimensions(end, true);
                start = this.getDimensions(new Point(intercept.x, intercept.y, intercept.z + 0.001), true);
            }
            else {
                start = this.getDimensions(start, true);
                end = this.getDimensions(new Point(intercept.x, intercept.y, intercept.z + 0.001), true);
            }
            return { start, end };
        }
    }

    const resolvePolygonPoints = (points, line) => {
        const { start, end } = line;
        if (start.z < 0 && end.z < 0) {
            return points;
        }
        if (start.z >= 0 && end.z >= 0) {
            points.push(this.getDimensions(start, true));
            return points;
        }
        const intercept = getPlaneLineIntersection(zeroZPlane, line);
        start.z >= 0 && points.push(
            this.getDimensions(start, true)
        );
        points.push(
            this.getDimensions(new Point(intercept.x, intercept.y, intercept.z + 0.001), true)
        );
        end.z >= 0 && points.push(
            this.getDimensions(end, true)
        );
        return points;
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

    const polygons = this.polygons
        .map(({ points, colour }) => new Polygon( points.map(x => manipulatePoint(this.centre, this.direction, x)), { colour } ))
        .map(({ points: polygonPoints, colour }) => {
            const points = [];
            polygonPoints.forEach((point, index) => {
                const nextPoint = polygonPoints[index === (polygonPoints.length - 1) ? 0 : (index + 1)];
                const line = new Line(point, nextPoint);
                resolvePolygonPoints(points, line);
            });
            if (points.length < 3) {
                return null;
            }
            return { points, colour };
        })
        .filter(polygon => polygon !== null);

    return { polygons, lines, points };
}
