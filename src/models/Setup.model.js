
import { Point } from "./Point.model";
import { Direction } from "./Direction.model";

export const Setup = function(
    centre = new Point(0, 0, 0),
    direction = new Direction(),
    aperture = 30,
    renderer = 2
){
    this.centre = centre;
    this.direction = direction;
    this.aperture = aperture;
    this.renderer = renderer;

    Object.freeze(this);
}
