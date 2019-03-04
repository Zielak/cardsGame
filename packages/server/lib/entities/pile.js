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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus_1 = require("colyseus");
var utils_1 = require("@cardsgame/utils");
var container_1 = require("./container");
var Pile = /** @class */ (function (_super) {
    __extends(Pile, _super);
    function Pile(options) {
        var _this = _super.call(this, options) || this;
        _this.type = "pile";
        _this.hijacksInteractionTarget = true;
        _this.cardsData = new Map();
        _this.limits = Object.assign({}, {
            minAngle: -45,
            maxAngle: 45,
            minX: -10,
            minY: -10,
            maxX: 10,
            maxY: 10
        }, options.limits);
        return _this;
    }
    Pile.prototype.onChildAdded = function (child) {
        this.cardsData.set(child.id, cardsDataFactory(this.limits));
    };
    Pile.prototype.onChildRemoved = function (childID) {
        this.cardsData.delete(childID);
    };
    Pile.prototype.restyleChild = function (child, idx, children) {
        var _a = this.cardsData.get(child.id) || DEFAULT_CARDS_DATA, x = _a.x, y = _a.y, angle = _a.angle;
        return {
            x: x,
            y: y,
            angle: angle
        };
    };
    __decorate([
        colyseus_1.nosync
    ], Pile.prototype, "limits", void 0);
    __decorate([
        colyseus_1.nosync
    ], Pile.prototype, "cardsData", void 0);
    return Pile;
}(container_1.Container));
exports.Pile = Pile;
var cardsDataFactory = function (limits) {
    return {
        x: utils_1.float(limits.minX, limits.maxX),
        y: utils_1.float(limits.minY, limits.maxY),
        angle: utils_1.float(limits.minAngle, limits.maxAngle)
    };
};
var DEFAULT_CARDS_DATA = {
    x: 0,
    y: 0,
    angle: 0
};
//# sourceMappingURL=pile.js.map