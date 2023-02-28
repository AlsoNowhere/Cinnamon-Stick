import { Point } from "../models/Point.model";

export const resolvePolygonPoints = function(
    points,
    line,
    planes
) {

    const startDimensions = this.getDimensions(line.start);
    const endDimensions = this.getDimensions(line.end);

    // console.log("INgo wars: ", line.start, line.end, "Dimensions", !!startDimensions, !!endDimensions);

    if (startDimensions === null
        || endDimensions === null) {
        this.addPointsAtEdgeOfView(points, line, planes);
    }

    // if (startDimensions !== null) {
    //     points.push(startDimensions)
    // }
    if (endDimensions !== null) {
        points.push(endDimensions)
    }

    // points.forEach(x => console.log("X: ", x));

}
