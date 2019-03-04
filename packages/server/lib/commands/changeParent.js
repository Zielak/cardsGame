"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var ChangeParent = /** @class */ (function () {
    function ChangeParent(ents, source, target) {
        this.entities = Array.isArray(ents) ? ents : [ents];
        this.source = source;
        this.target = target;
        if (this.entities.length < 1 || !this.source || !this.target) {
            throw new Error("I'm missing something...");
        }
    }
    ChangeParent.prototype.execute = function (state) {
        var _this = this;
        var _ = this.constructor.name;
        logs_1.logs.log("┍━" + _, "executing");
        if (this.entities.length < 1) {
            logs_1.logs.error("ChangeParent command", "I don't have an entity to move!");
            return;
        }
        logs_1.logs.log("│ " + _, "starting, moving", this.entities, "entities from", this.source, "to", this.target);
        this.entities.forEach(function (entity) {
            _this.target.addChild(entity);
        });
        logs_1.logs.log("┕━" + _, "done");
        // state.logTreeState()
    };
    ChangeParent.prototype.undo = function (state) {
        var _this = this;
        this.entities.forEach(function (entity) {
            _this.source.addChild(entity);
        });
    };
    return ChangeParent;
}());
exports.ChangeParent = ChangeParent;
//# sourceMappingURL=changeParent.js.map