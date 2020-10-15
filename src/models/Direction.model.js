
export const Direction = function(
    zx = 0,
    y = 0
){
    this.zx = zx;
    this.y = y;

    Object.freeze(this);
}
