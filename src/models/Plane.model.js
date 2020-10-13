
export const Plane = function(
    x,
    y,
    z,
    d
){
    this.x = x;
    this.y = y;
    this.z = z;
    this.d = d;

    Object.freeze(this);
}
