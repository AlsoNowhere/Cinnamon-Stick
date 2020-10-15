
export const Polygon = function(
    points = [],
    options = {
        colour: "#444"
    }
){
    this.points = points;
    this.colour = options.colour;

    Object.freeze(this);
}
