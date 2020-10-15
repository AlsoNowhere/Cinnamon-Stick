
import { RADIANS } from "../data/RADIANS.data";

export const getDimensions = function(point, force = false) {
    if (point.z < 0) {
        return null;
    }

    const zx_y_angle = Math.atan(point.y / point.z) * RADIANS;
    const x_z_angle = Math.atan(point.x / point.z) * RADIANS;

    if (!force && (zx_y_angle < 0 ? zx_y_angle * -1 : zx_y_angle) > this.aperture.y) {
        return null;
    }
    if (!force && (x_z_angle < 0 ? x_z_angle * -1 : x_z_angle) > this.aperture.zx ) {
        return null;
    }

    const width = this.width / 2 + x_z_angle / this.aperture.zx * this.width / 2;
    const height = this.height / 2 - zx_y_angle / this.aperture.y * this.height / 2;

    return { width, height };
}
