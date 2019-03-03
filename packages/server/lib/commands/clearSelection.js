import { logs } from "../logs";
export class ClearSelection {
    constructor(player) {
        this.player = player;
    }
    execute(state) {
        const _ = this.constructor.name;
        logs.log(_, "executing");
        this.deselected = this.player.clearSelection();
    }
    undo() {
        for (let entity of this.deselected) {
            this.player.selectEntity(entity);
        }
    }
}
//# sourceMappingURL=clearSelection.js.map