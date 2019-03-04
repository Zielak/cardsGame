"use strict";
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
var logs_1 = require("../logs");
var ClearSelection = /** @class */ (function () {
    function ClearSelection(player) {
        this.player = player;
    }
    ClearSelection.prototype.execute = function (state) {
        var _ = this.constructor.name;
        logs_1.logs.log(_, "executing");
        this.deselected = this.player.clearSelection();
    };
    ClearSelection.prototype.undo = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.deselected), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entity = _c.value;
                this.player.selectEntity(entity);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return ClearSelection;
}());
exports.ClearSelection = ClearSelection;
//# sourceMappingURL=clearSelection.js.map