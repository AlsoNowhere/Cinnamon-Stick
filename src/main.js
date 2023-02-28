
import { logger } from "sage-library";

import { render as render1 } from "./services/render.service";
import { render as render2 } from "./services/render2.service";
import { render as render3 } from "./services/render3.service";

import { generateAperture } from "./logic/generate-aperture.logic";
import { getDimensions } from "./logic/get-dimensions.logic";
import { getLineDimensions } from "./logic/get-line-dimensions.logic";
import { addPointsAtEdgeOfView } from "./logic/add-points-at-edge-of-view.logic";
import { getCorners } from "./logic/get-corners.logic";
import { resolvePolygonPoints } from "./logic/resolve-polygon-points.logic";

import { Setup } from "./models/Setup.model";

const renders = [render1, render2, render3];

export const CinnamonStick = function(
    target,
    setup = new Setup()
){
    if (!(target instanceof Element)) {
        return logger.error("Cinnamon Stick", "CinnamonStick", "target", `Target must be an instance of Element.`);
    }

    this.target = target;
    this.width = target.clientWidth;
    this.height = target.clientHeight;

/* CANVAS Element */
    if (target.nodeName === "CANVAS") {
        target.width = target.clientWidth;
        target.height = target.clientHeight;
    }

    this.centre = setup.centre;
    this.direction = setup.direction;
    this.aperture = generateAperture(setup.aperture, this.width, this.height);
    this.render = renders[setup.renderer - 1];

    this.points = [];
    this.lines = [];
    this.polygons = [];
}
CinnamonStick.prototype = {
    getDimensions,
    getLineDimensions,
    addPointsAtEdgeOfView,
    getCorners,
    resolvePolygonPoints
}

export { Point } from "./models/Point.model";
export { Line } from "./models/Line.model";
export { Polygon } from "./models/Polygon.model";

export { Setup } from "./models/Setup.model";
export { Direction } from "./models/Direction.model";

export { RADIANS } from "./data/RADIANS.data";
