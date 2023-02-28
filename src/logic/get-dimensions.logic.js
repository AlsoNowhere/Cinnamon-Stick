
import { RADIANS } from "../data/RADIANS.data";

export const getDimensions = function(point, forceResolve = false) {
    if (point.z < 0) {
        return null;
    }

    const zx_y_angle = Math.atan(point.y / point.z) * RADIANS;
    const x_z_angle = Math.atan(point.x / point.z) * RADIANS;



/*
    Check if the angles to the points is greater than the view, if so return.
    Unless we know better and have sent the forceResolve flag to true.
*/
    if (!forceResolve && (zx_y_angle < 0 ? zx_y_angle * -1 : zx_y_angle) > this.aperture.y) {
        return null;
    }
    if (!forceResolve && (x_z_angle < 0 ? x_z_angle * -1 : x_z_angle) > this.aperture.zx ) {
        return null;
    }

    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    // console.log("Goose ---=======------")
    // console.log("Stuff: ", x_z_angle, zx_y_angle, point, "|", this.aperture, "||", x_z_angle / this.aperture.zx, zx_y_angle / this.aperture.y);

    const width = halfWidth + x_z_angle / this.aperture.zx * halfWidth;
    const height = halfHeight - zx_y_angle / this.aperture.y * halfHeight;

    return { width, height };
}
