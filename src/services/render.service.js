
import { getPlaneFromThreePoints } from "./get-plane-from-three-points.service";

import { manipulatePoint } from "./manipulate-point.service";

import { Point } from "../models/Point.model";
import { Line } from "../models/Line.model";
import { Polygon } from "../models/Polygon.model";
import { RenderPoint } from "../models/RenderPoint.model";

import { RADIANS } from "../data/RADIANS.data";

export const render = function(){

    const topPlane = getPlaneFromThreePoints(
        new Point(0,0,0),
        new Point(0,Math.tan(this.aperture.y / RADIANS) * 10,10),
        new Point(10,Math.tan(this.aperture.y / RADIANS) * 10,10),
    );
    const rightPlane = getPlaneFromThreePoints(
        new Point(0,0,0),
        new Point(Math.tan(this.aperture.zx / RADIANS) * 10,0,10),
        new Point(Math.tan(this.aperture.zx / RADIANS) * 10,10,10),
    );
    const bottomPlane = getPlaneFromThreePoints(
        new Point(0,0,0),
        new Point(0,-Math.tan(this.aperture.y / RADIANS) * 10,10),
        new Point(10,-Math.tan(this.aperture.y / RADIANS) * 10,10),
    );
    const leftPlane = getPlaneFromThreePoints(
        new Point(0,0,0),
        new Point(-Math.tan(this.aperture.zx / RADIANS) * 10,0,10),
        new Point(-Math.tan(this.aperture.zx / RADIANS) * 10,10,10),
    );

    const points = this.points
        .map(point => {
            return manipulatePoint(this.centre, this.direction, point);
        })
        .map(point => {
            const dimensions = this.getDimensions(point);

            if (dimensions === null) {
                return null;
            }

            const {width, height} = dimensions;

            if (isNaN(width) || isNaN(height)) {
                return null;
            }

            return new RenderPoint(
                width,
                height
            );
        })
        .filter(point => point !== null);

    const lines = this.lines
        .map(line => {
            return new Line(
                manipulatePoint(this.centre, this.direction, line.start),
                manipulatePoint(this.centre, this.direction, line.end),
                { colour: line.colour }
            );
        })
        .map(line => {
            
            const lineDimensions = this.getLineDimensions(line, topPlane, rightPlane, bottomPlane, leftPlane);

            if (lineDimensions === null) {
                return null;
            }

            const { startDimensions, endDimensions } = lineDimensions;

            const {width: startWidth, height: startHeight} = startDimensions;
            const {width: endWidth, height: endHeight} = endDimensions;

            return {
                startWidth,
                startHeight,
                endWidth,
                endHeight,
                colour: line.colour
            };
        })
        .filter(line => line !== null);

    const polygons = this.polygons
        .map(polygon => {
            return new Polygon(
                polygon.points.map(x => manipulatePoint(this.centre, this.direction, x)),
                { colour: polygon.colour }
            );
        })
        .map(polygon => {

            const newPoints = [];

            polygon.points.forEach((point, index) => {
                const nextPoint = polygon.points[index === (polygon.points.length - 1) ? 0 : (index + 1)];

                const line = new Line(point, nextPoint);
            
                const lineDimensions = this.getLineDimensions(line, topPlane, rightPlane, bottomPlane, leftPlane);

                if (lineDimensions === null) {
                    return;
                }

                const { 
                    startDimensions, 
                    endDimensions,
                metaData } = lineDimensions;

                const {width: startWidth, height: startHeight} = startDimensions;
                const {width: endWidth, height: endHeight} = endDimensions;

                if (metaData.start || metaData.both) {
                    newPoints.push(
                        {
                            width: startWidth,
                            height: startHeight
                        }
                    );
                }
                newPoints.push(
                    {
                        width: endWidth,
                        height: endHeight
                    }
                );
            });

            if (newPoints.length < 3) {
                return null;
            }

            return {
                points: newPoints,
                colour: polygon.colour
            }
        })
        .filter(polygon => polygon !== null);

    return {
        points,
        lines,
        polygons
    };
}
