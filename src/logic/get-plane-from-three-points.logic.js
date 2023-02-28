
import { Plane } from "../models/Plane.model";

export const getPlaneFromThreePoints = (A,B,C) => {
    const a = (B.y-A.y) * (C.z-A.z)-(C.y-A.y) * (B.z-A.z);
    const b = (B.z-A.z) * (C.x-A.x)-(C.z-A.z) * (B.x-A.x);
    const c = (B.x-A.x) * (C.y-A.y)-(C.x-A.x) * (B.y-A.y);
    const d = -(a * A.x + b * A.y + c * A.z);

    return new Plane(a,b,c,d);
}
