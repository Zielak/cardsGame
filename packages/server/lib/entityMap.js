"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus_1 = require("colyseus");
var entity_1 = require("./entity");
var utils_1 = require("@cardsgame/utils");
var logs_1 = require("./logs");
var EntityMap = /** @class */ (function () {
    function EntityMap() {
    }
    EntityMap.prototype.add = function (entity) {
        var idx = this.length;
        this[idx] = entity;
        return idx;
        // notifyNewIdx(entity, idx)
    };
    EntityMap.prototype.remove = function (_idx) {
        var idx = typeof _idx === "number" ? _idx : parseInt(_idx);
        if (typeof this[idx] === "undefined") {
            return false;
        }
        exports.notifyNewIdx(this[idx], undefined);
        delete this[idx];
        this.updateOrder();
        return true;
    };
    /**
     * Makes sure that every child is at its own
     * unique 'idx' value, starting with 0
     */
    EntityMap.prototype.updateOrder = function () {
        var _this = this;
        var keys = Object.keys(this);
        keys.forEach(function (_key, idx) {
            var key = parseInt(_key);
            if (key === idx)
                return;
            // We've got empty space right here
            if (_this[idx] === undefined) {
                _this[idx] = _this[key];
                delete _this[key];
                exports.notifyNewIdx(_this[idx], idx);
            }
            else {
                _this[idx] = _this[key];
                exports.notifyNewIdx(_this[idx], idx);
                throw new Error("I don't know how that happened to be honest");
            }
        });
        return this;
    };
    EntityMap.prototype.toArray = function () {
        var arr = [];
        for (var key in this) {
            arr.push(this[key]);
        }
        return arr;
    };
    Object.defineProperty(EntityMap.prototype, "length", {
        get: function () {
            return Object.keys(this).length;
        },
        enumerable: true,
        configurable: true
    });
    EntityMap.byName = function (name) { return function (entity) {
        return entity.name === name;
    }; };
    EntityMap.byType = function (type) { return function (entity) {
        return entity.type === type;
    }; };
    EntityMap.sortByIdx = function (a, b) { return a.idx - b.idx; };
    __decorate([
        colyseus_1.nosync
    ], EntityMap.prototype, "add", null);
    __decorate([
        colyseus_1.nosync
    ], EntityMap.prototype, "remove", null);
    __decorate([
        colyseus_1.nosync
    ], EntityMap.prototype, "updateOrder", null);
    __decorate([
        colyseus_1.nosync
    ], EntityMap.prototype, "toArray", null);
    __decorate([
        colyseus_1.nosync
    ], EntityMap.prototype, "length", null);
    return EntityMap;
}());
exports.EntityMap = EntityMap;
exports.notifyNewIdx = function (entity, idx) {
    if (entity instanceof entity_1.Entity) {
        var e = entity;
        logs_1.logs.verbose("notifyNewIdx", e.type + ":" + e.name, "[" + entity.idx + " => " + idx + "]");
        e.emit(utils_1.EntityEvents.idxUpdate, idx);
    }
};
//# sourceMappingURL=entityMap.js.map