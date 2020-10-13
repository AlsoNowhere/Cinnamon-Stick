import { getDistance } from "../services/get-distance.service";

export const Line = function(
    start,
    end,
    options = {
        colour: "#444"
    }
){
    this.start = start;
    this.end = end;
    
    const difference = {
        x: end.x - start.x,
        y: end.y - start.y,
        z: end.z - start.z
    }

    const x = {c: start.x, t: difference.x};
    const y = {c: start.y, t: difference.y};
    const z = {c: start.z, t: difference.z};

    this.parametric = {x, y, z};

    this.distance = getDistance(start, end);

    this.colour = options.colour;

    Object.freeze(this);
}
