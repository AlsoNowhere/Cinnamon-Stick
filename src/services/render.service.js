
import { getPlaneFromThreePoints } from "../logic/get-plane-from-three-points.logic";
import { manipulatePoint } from "./manipulate-point.service";

import { Point } from "../models/Point.model";
import { Line } from "../models/Line.model";
import { Polygon } from "../models/Polygon.model";
import { RenderPoint } from "../models/RenderPoint.model";

import { RADIANS } from "../data/RADIANS.data";

export const render = function(){

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
    const planes = { topViewPlane, rightViewPlane, bottomViewPlane, leftViewPlane };

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
            

/*
    GET POINTS FOR LINE
    This method returns calculated points from two points.
    If it returns null it's because not only do both points provided line outside of the view but they also don't cross in front of the view.
    If the points lie outside of the view or cross it this method will return the points on the edge of the view where the line goes out and or the point if it is inside the view.
    That way when we get the dimensions here we merely need to put the line on the screen if not null, we don't need to work anything else out.
*/
            const lineDimensions = this.getLineDimensions(line, topViewPlane, rightViewPlane, bottomViewPlane, leftViewPlane);

            if (lineDimensions === null) {
                return null;
            }

            const { startDimensions, endDimensions } = lineDimensions;

            const { width: startWidth, height: startHeight } = startDimensions;
            const { width: endWidth, height: endHeight } = endDimensions;

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

            const points = [];
            // let previousLineDimensions = null;
            // let firstLineDimensions = null;

            polygon.points.forEach((point, index) => {

                const nextPoint = polygon.points[index === (polygon.points.length - 1) ? 0 : (index + 1)];
                const line = new Line(point, nextPoint);



                this.resolvePolygonPoints(points, line, planes);

                // const lineDimensions = this.getLineDimensions(line, topViewPlane, rightViewPlane, bottomViewPlane, leftViewPlane);

                // console.log("lineDimensions: ", lineDimensions, "point ", point, "nextPoint", nextPoint);

                // if (lineDimensions === null) {
                //     this.addPointsAtEdgeOfView(newPoints, line, rightViewPlane, leftViewPlane);
                //     return;
                // }

                // const { startDimensions, endDimensions, metaData } = lineDimensions;
                // const { width: startWidth, height: startHeight } = startDimensions;
                // const { width: endWidth, height: endHeight } = endDimensions;

                // console.log("Decide: ",
                //     startDimensions,
                //     endDimensions,
                //     "|",
                //     metaData,
                //     "|",
                //     point,
                //     nextPoint
                // );

                // previousLineDimensions && this.getCorners(
                //     newPoints,
                //     lineDimensions,
                //     previousLineDimensions
                // );

                // if (metaData.start || metaData.both) {
                //     newPoints.push(
                //         {
                //             width: startWidth,
                //             height: startHeight
                //         }
                //     );
                // }
                // newPoints.push(
                //     {
                //         width: endWidth,
                //         height: endHeight
                //     }
                // );
                // previousLineDimensions = lineDimensions;
                // if (index === 0 || firstLineDimensions === null) {
                //     firstLineDimensions = lineDimensions;
                // }
            });

            // this.getCorners(
            //     newPoints,
            //     firstLineDimensions,
            //     previousLineDimensions
            // );


            // console.log("NewPoints: ", points);

            if (points.length < 3) {
                return null;
            }

            return {
                points,
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
