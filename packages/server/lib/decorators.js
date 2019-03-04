"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus_1 = require("colyseus");
exports.nosync = colyseus_1.nosync;
var utils_1 = require("@cardsgame/utils");
function condvis(target, key) {
    Object.defineProperty(target, key, {
        get: function () {
            // State doesn't need to know of this props existance
            return undefined;
        },
        set: function (val) {
            var entity = this;
            // Now it will be visible by the state?
            // For how long? Is it?
            Object.defineProperty(this, key, {
                value: val,
                writable: true,
                enumerable: false,
                configurable: true
            });
            // Emits single private attribute update change
            if (entity._visibilityData.shouldSendToEveryone(key)) {
                this.emit.call(this, utils_1.EntityEvents.sendPropToEveryone, key);
            }
            if (entity._visibilityData.shouldSendToOwner(key)) {
                this.emit.call(this, utils_1.EntityEvents.sendPropToOwner, key);
            }
        },
        enumerable: false
    });
}
exports.condvis = condvis;
//# sourceMappingURL=decorators.js.map