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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus_1 = require("colyseus");
var entity_1 = require("./entity");
var utils_1 = require("@cardsgame/utils");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(options) {
        var _this = _super.call(this, options) || this;
        _this.type = "player";
        _this.score = 0;
        _this.timeLeft = Infinity;
        _this.clientID = options.clientID;
        _this._selectedEntities = new Set();
        return _this;
    }
    /**
     * Will make this element selected in
     * the eyes of this player. This knowledge
     * is not shared with others by default.
     * @param entity
     */
    Player.prototype.selectEntity = function (entity) {
        this._selectedEntities.add(entity);
        var event = {
            path: entity.idxPath,
            owner: this.clientID,
            public: false,
            attribute: "selected",
            value: true
        };
        this._state.emit(utils_1.EntityEvents.privateAttributeChange, event);
        this.selectedEntitiesCount = this._selectedEntities.size;
    };
    Player.prototype.deselectEntity = function (entity) {
        this._selectedEntities.delete(entity);
        var event = {
            path: entity.idxPath,
            owner: this.clientID,
            public: false,
            attribute: "selected",
            value: false
        };
        this._state.emit(utils_1.EntityEvents.privateAttributeChange, event);
        this.selectedEntitiesCount = this._selectedEntities.size;
    };
    Player.prototype.clearSelection = function () {
        var e_1, _a;
        var deselected = [];
        try {
            for (var _b = __values(this._selectedEntities.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entity = _c.value;
                deselected.push(entity);
                this.deselectEntity(entity);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return deselected;
    };
    Player.prototype.isEntitySelected = function (entity) {
        return this._selectedEntities.has(entity);
    };
    Object.defineProperty(Player.prototype, "selectedEntities", {
        get: function () {
            return Array.from(this._selectedEntities.values());
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        colyseus_1.nosync
    ], Player.prototype, "_selectedEntities", void 0);
    return Player;
}(entity_1.Entity));
exports.Player = Player;
//# sourceMappingURL=player.js.map