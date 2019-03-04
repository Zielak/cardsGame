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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("./card");
var logs_1 = require("../logs");
var decorators_1 = require("../decorators");
var ClassicCard = /** @class */ (function (_super) {
    __extends(ClassicCard, _super);
    function ClassicCard(options) {
        var _this = _super.call(this, options) || this;
        _this.type = "classicCard";
        _this._visibilityData.add(["name", "suit", "rank"], 
        /* toEveryone */ function () { return _this.faceUp; }, 
        /* toOwner */ function () {
            // Only if it's in his hand
            var parentContainer = _this.parentEntity;
            return parentContainer.type === "hand";
        });
        _this.suit = options.suit;
        _this.rank = options.rank;
        _this.name = _this.rank + _this.suit;
        return _this;
    }
    __decorate([
        decorators_1.condvis
    ], ClassicCard.prototype, "name", void 0);
    __decorate([
        decorators_1.condvis
    ], ClassicCard.prototype, "suit", void 0);
    __decorate([
        decorators_1.condvis
    ], ClassicCard.prototype, "rank", void 0);
    return ClassicCard;
}(card_1.Card));
exports.ClassicCard = ClassicCard;
exports.standardDeck = function (ranks, suits) {
    if (ranks === void 0) { ranks = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A"
    ]; }
    if (suits === void 0) { suits = ["H", "S", "C", "D"]; }
    var cards = suits.reduce(function (prevS, suit) { return __spread(prevS, ranks.reduce(function (prevR, rank) { return __spread(prevR, [{ suit: suit, rank: rank }]); }, [])); }, []);
    logs_1.logs.verbose("created a deck of " + cards.length + " cards");
    return cards;
};
//# sourceMappingURL=classicCard.js.map