
import { getPlaneFromThreePoints } from "./get-plane-from-three-points.service";
import { getPlaneLineIntersection } from "./get-plane-line-intersect.service";

import { Point } from "../models/Point.model";
import { RenderPoint } from "../models/RenderPoint.model";

import { RADIANS } from "../data/RADIANS.data";
import { isPointOnLine } from "./is-point-on-line.service";
import { Line } from "../models/Line.model";

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

    const points = this.points.map(point => {
        const dimensions = this.getDimenstions(point);

        if (dimensions === null) {
            return null;
        }

        const {width, height} = dimensions;

        return new RenderPoint(
            width,
            height
        );
    })
    .filter(point => point !== null);

    const lines = this.lines.map(line => {
        let startDimensions = this.getDimenstions(line.start);
        let endDimensions = this.getDimenstions(line.end);

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

        // console.log("Dig: ", validPlaneIntersects,

        //     topIntersect,
        //     rightIntersect,
        //     bottomIntersect,
        //     leftIntersect,

        //     isTopIntersectValid,
        //     isRightIntersectValid,
        //     isBottomIntersectValid,
        //     isLeftIntersectValid,

        // );

        if (startDimensions === null
            && endDimensions === null) {

            if (validPlaneIntersects.length === 2) {
                const dimensionsStart = this.getDimenstions(validPlaneIntersects[0]);
                const dimensionsEnd = this.getDimenstions(validPlaneIntersects[1]);
                startDimensions = dimensionsStart;
                endDimensions = dimensionsEnd;
            }
            else {
                return null;
            }

        }

        if (endDimensions === null) {
            if (validPlaneIntersects.length === 1) {
                const dimensions = this.getDimenstions(validPlaneIntersects[0]);
                endDimensions = dimensions;
            }
            else {
                return null;
            }
        }

        if (startDimensions === null) {
            if (validPlaneIntersects.length === 1) {
                const dimensions = this.getDimenstions(validPlaneIntersects[0]);
                startDimensions = dimensions;
            }
            else {
                return null;
            }
        }


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

    return {
        points,
        lines
    };

}
