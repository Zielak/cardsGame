"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var entityMap_1 = require("../entityMap");
var ShuffleChildren = /** @class */ (function () {
    function ShuffleChildren(container) {
        this.container = container;
    }
    ShuffleChildren.prototype.execute = function (state) {
        logs_1.logs.log("" + this.constructor.name, "executing");
        var fromIdx = this.container.children.length;
        if (fromIdx === 0)
            return;
        while (--fromIdx) {
            var toIdx = Math.floor(Math.random() * (fromIdx + 1));
            var childi = this.container.children[fromIdx];
            var childj = this.container.children[toIdx];
            this.container.children[fromIdx] = childj;
            this.container.children[toIdx] = childi;
            entityMap_1.notifyNewIdx(childi, toIdx);
            entityMap_1.notifyNewIdx(childj, fromIdx);
        }
        state.logTreeState();
    };
    return ShuffleChildren;
}());
exports.ShuffleChildren = ShuffleChildren;
//# sourceMappingURL=shuffleChildren.js.map