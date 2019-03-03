// const Bezier = require("bezier-js") as typeof BezierJs.Bezier
import Bezier from "bezier-js";
import { Container } from "./container";
/**
 * TODO: Should ensure that none of the cards in hand
 * are visible to other players
 */
export class Hand extends Container {
    constructor() {
        super(...arguments);
        this.type = "hand";
    }
    restyleChild(child, idx, arr) {
        const max = arr.length;
        const maxSpread = 8;
        const outerX = maxSpread + max / 3;
        const addY = max > maxSpread ? -(maxSpread - max) / 5 : 0;
        //    [1]----[2]
        //    /       \
        //   /         \
        // [0]        [3]
        const b = new Bezier([
            { x: -outerX, y: 3 + addY },
            { x: -outerX + outerX / 2.5, y: -3 - addY },
            { x: outerX - outerX / 2.5, y: -3 - addY },
            { x: outerX, y: 3 + addY }
        ]);
        const space = 1 / maxSpread;
        let perc = idx / (max - 1);
        // Outer padding, from edge to the card
        const P = () => {
            // max
            //  1 -> 0
            var m = Math.abs(Math.min(0, max - maxSpread));
            var P = m / (maxSpread - 1) / 2;
            return P;
        };
        perc = max <= maxSpread ? P() + space * idx + space / 2 : perc;
        const point = b.get(perc);
        const n = b.normal(perc);
        return {
            x: point.x * 10,
            y: point.y * 10,
            angle: (Math.atan2(n.y, n.x) * 180) / Math.PI + 270
        };
    }
}
//# sourceMappingURL=hand.js.map