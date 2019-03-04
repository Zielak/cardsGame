"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VisibilityData = /** @class */ (function () {
    function VisibilityData() {
        this.data = {};
    }
    VisibilityData.prototype.add = function (keys, toEveryone, toOwner) {
        var _this = this;
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        keys.forEach(function (key) {
            _this.data[key] = {
                toEveryone: toEveryone,
                toOwner: toOwner
            };
        });
    };
    VisibilityData.prototype.shouldSendToEveryone = function (key) {
        if (!this.data[key] || !this.data[key].toEveryone) {
            return;
        }
        return this.data[key].toEveryone();
    };
    VisibilityData.prototype.shouldSendToOwner = function (key) {
        if (!this.data[key] || !this.data[key].toOwner) {
            return;
        }
        return this.data[key].toOwner();
    };
    Object.defineProperty(VisibilityData.prototype, "keys", {
        get: function () {
            return Object.keys(this.data);
        },
        enumerable: true,
        configurable: true
    });
    return VisibilityData;
}());
exports.VisibilityData = VisibilityData;
//# sourceMappingURL=visibilityData.js.map