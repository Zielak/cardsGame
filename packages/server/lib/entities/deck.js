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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@cardsgame/utils");
var container_1 = require("./container");
var Deck = /** @class */ (function (_super) {
    __extends(Deck, _super);
    function Deck() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "deck";
        _this.hijacksInteractionTarget = true;
        return _this;
    }
    Deck.prototype.restyleChild = function (child, idx, children) {
        var MAX_HEIGHT = utils_1.cm2px(2.5);
        var MIN_SPACE = utils_1.cm2px(0.1);
        var SPACE = utils_1.limit(MAX_HEIGHT / children.length, 0, MIN_SPACE);
        // const OFFSET_ALL = SPACE * children.length
        return {
            x: idx * SPACE,
            y: -idx * SPACE,
            angle: 0
        };
    };
    return Deck;
}(container_1.Container));
exports.Deck = Deck;
//# sourceMappingURL=deck.js.map