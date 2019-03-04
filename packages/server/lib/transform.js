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
var eventemitter3_1 = require("eventemitter3");
var EntityTransform = /** @class */ (function (_super) {
    __extends(EntityTransform, _super);
    function EntityTransform(x, y, angle) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (angle === void 0) { angle = 0; }
        var _this = _super.call(this) || this;
        _this._x = x;
        _this._y = y;
        _this._angle = angle;
        return _this;
    }
    Object.defineProperty(EntityTransform.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
            this.emit("update");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityTransform.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
            this.emit("update");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityTransform.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (value) {
            this._angle = value;
            this.emit("update");
        },
        enumerable: true,
        configurable: true
    });
    return EntityTransform;
}(eventemitter3_1.EventEmitter));
exports.EntityTransform = EntityTransform;
//# sourceMappingURL=transform.js.map