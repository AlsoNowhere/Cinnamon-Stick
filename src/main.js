
import { logger } from "sage-library";

import { render } from "./services/render.service";
import { generateAperture } from "./services/generate-aperture.service";
import { getDimensions } from "./services/get-dimensions.service";
import { getLineDimensions } from "./services/get-line-dimensions.service";

import { Setup } from "./models/Setup.model";

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

    this.points = [];
    this.lines = [];
    this.polygons = [];

    this.render = render;
}
CinnamonStick.prototype = {
    getDimensions,
    getLineDimensions
}

export { Point } from "./models/Point.model";
export { Line } from "./models/Line.model";
export { Polygon } from "./models/Polygon.model";

export { Setup } from "./models/Setup.model";
export { Direction } from "./models/Direction.model";

export { RADIANS } from "./data/RADIANS.data";
