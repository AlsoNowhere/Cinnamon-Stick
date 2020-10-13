
import { logger } from "sage";

import { render } from "./services/render.service";
import { generateAperture } from "./services/generate-aperture.service";
import { getDimenstions } from "./services/get-dimensions.service";

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

    this.centre = setup.centre;
    this.direction = setup.direction;
    this.aperture = generateAperture(setup.aperture, this.width, this.height);

    this.points = [];
    this.lines = [];

    this.render = render;
}
CinnamonStick.prototype = {
    getDimenstions
}

export { Point } from "./models/Point.model";
export { Line } from "./models/Line.model";
export { Direction } from "./models/Direction.model";

export { RADIANS } from "./data/RADIANS.data";
