
export const Direction = function(
    zx = 0,
    y = 90
){
    this.zx = zx;
    this.y = y;

    Object.freeze(this);
}
