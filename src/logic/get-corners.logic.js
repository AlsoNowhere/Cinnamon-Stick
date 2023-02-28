
export const getCorners = function(
    newPoints,
    { startDimensions, metaData },
    { endDimensions: previousEndData, metaData: previousMetaData }
){


    if (metaData.start && previousMetaData.end) {

                    

        if (Math.round(previousEndData.width) === 0) {
            if (Math.round(startDimensions.height) === 0) {
                newPoints.push({ width: 0, height: 0 });
            }
            else if (Math.round(startDimensions.height) === this.height) {
                newPoints.push({ width: 0, height: this.height });
            }
        }
        if (Math.round(previousEndData.width) === this.width) {
            if (Math.round(startDimensions.height) === 0) {
                newPoints.push({ width: this.width, height: 0 });
            }
            else if (Math.round(startDimensions.height) === this.height) {
                newPoints.push({ width: this.width, height: this.height });
            }
        }
        if (Math.round(previousEndData.height) === 0) {
            if (Math.round(startDimensions.width) === 0) {
                newPoints.push({ width: 0, height: 0 });
            }
            else if (Math.round(startDimensions.width) === this.width) {
                newPoints.push({ width: this.width, height: 0 });
            }
        }
        if (Math.round(previousEndData.height) === this.height) {
            if (Math.round(startDimensions.width) === 0) {
                newPoints.push({ width: 0, height: this.height });
            }
            else if (Math.round(startDimensions.width) === this.width) {
                newPoints.push({ width: this.width, height: this.height });
            }
        }
    }


}
