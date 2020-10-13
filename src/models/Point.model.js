
export const Point = function(
    x,
    y,
    z
){
    this.valid = !isNaN(x) && !isNaN(y) && !isNaN(z);

    this.x = x;
    this.y = y;
    this.z = z;

    Object.freeze(this);
}
