"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs");
var SelectEntity = /** @class */ (function () {
    function SelectEntity(player, entity, selected) {
        this.player = player;
        this.entity = entity;
        this.selected = selected;
    }
    SelectEntity.prototype.execute = function (state) {
        var _ = this.constructor.name;
        logs_1.logs.log(_, "executing");
        if (this.selected) {
            this.player.selectEntity(this.entity);
        }
        else {
            this.player.deselectEntity(this.entity);
        }
    };
    SelectEntity.prototype.undo = function () {
        if (this.selected) {
            this.player.deselectEntity(this.entity);
        }
        else {
            this.player.selectEntity(this.entity);
        }
    };
    return SelectEntity;
}());
exports.SelectEntity = SelectEntity;
//# sourceMappingURL=selectEntity.js.map