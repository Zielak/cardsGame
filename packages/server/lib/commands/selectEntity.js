import { logs } from "../logs";
export class SelectEntity {
    constructor(player, entity, selected) {
        this.player = player;
        this.entity = entity;
        this.selected = selected;
    }
    execute(state) {
        const _ = this.constructor.name;
        logs.log(_, "executing");
        if (this.selected) {
            this.player.selectEntity(this.entity);
        }
        else {
            this.player.deselectEntity(this.entity);
        }
    }
    undo() {
        if (this.selected) {
            this.player.deselectEntity(this.entity);
        }
        else {
            this.player.selectEntity(this.entity);
        }
    }
}
//# sourceMappingURL=selectEntity.js.map