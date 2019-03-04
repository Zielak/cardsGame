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
var entity_1 = require("../entity");
var utils_1 = require("@cardsgame/utils");
var decorators_1 = require("../decorators");
var Card = /** @class */ (function (_super) {
    __extends(Card, _super);
    function Card(options) {
        var _this = _super.call(this, options) || this;
        _this.type = "card";
        _this.faceUp = utils_1.def(options.faceUp, false);
        _this.rotated = utils_1.def(options.rotated, 0);
        _this.marked = utils_1.def(options.marked, false);
        _this.visibleToPublic = _this.faceUp;
        return _this;
    }
    Card.prototype.flip = function () {
        this.faceUp = !this.faceUp;
        this.updateVisibleToPublic();
    };
    Card.prototype.show = function () {
        this.faceUp = true;
        this.updateVisibleToPublic();
    };
    Card.prototype.hide = function () {
        this.faceUp = false;
        this.updateVisibleToPublic();
    };
    Card.prototype.updateVisibleToPublic = function () {
        this.visibleToPublic = this.faceUp;
        this.sendAllPrivateAttributes();
    };
    __decorate([
        decorators_1.nosync
    ], Card.prototype, "id", void 0);
    return Card;
}(entity_1.Entity));
exports.Card = Card;
//# sourceMappingURL=card.js.map