"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const Bezier = require("bezier-js") as typeof BezierJs.Bezier
var bezier_js_1 = __importDefault(require("bezier-js"));
var container_1 = require("./container");
/**
 * TODO: Should ensure that none of the cards in hand
 * are visible to other players
 */
var Hand = /** @class */ (function (_super) {
    __extends(Hand, _super);
    function Hand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "hand";
        return _this;
    }
    Hand.prototype.restyleChild = function (child, idx, arr) {
        var max = arr.length;
        var maxSpread = 8;
        var outerX = maxSpread + max / 3;
        var addY = max > maxSpread ? -(maxSpread - max) / 5 : 0;
        //    [1]----[2]
        //    /       \
        //   /         \
        // [0]        [3]
        var b = new bezier_js_1.default([
            { x: -outerX, y: 3 + addY },
            { x: -outerX + outerX / 2.5, y: -3 - addY },
            { x: outerX - outerX / 2.5, y: -3 - addY },
            { x: outerX, y: 3 + addY }
        ]);
        var space = 1 / maxSpread;
        var perc = idx / (max - 1);
        // Outer padding, from edge to the card
        var P = function () {
            // max
            //  1 -> 0
            var m = Math.abs(Math.min(0, max - maxSpread));
            var P = m / (maxSpread - 1) / 2;
            return P;
        };
        perc = max <= maxSpread ? P() + space * idx + space / 2 : perc;
        var point = b.get(perc);
        var n = b.normal(perc);
        return {
            x: point.x * 10,
            y: point.y * 10,
            angle: (Math.atan2(n.y, n.x) * 180) / Math.PI + 270
        };
    };
    return Hand;
}(container_1.Container));
exports.Hand = Hand;
//# sourceMappingURL=hand.js.map