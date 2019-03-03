import { logs } from "../logs";
export class ChangeParent {
    constructor(ents, source, target) {
        this.entities = Array.isArray(ents) ? ents : [ents];
        this.source = source;
        this.target = target;
        if (this.entities.length < 1 || !this.source || !this.target) {
            throw new Error(`I'm missing something...`);
        }
    }
    execute(state) {
        const _ = this.constructor.name;
        logs.log("┍━" + _, "executing");
        if (this.entities.length < 1) {
            logs.error("ChangeParent command", `I don't have an entity to move!`);
            return;
        }
        logs.log("│ " + _, "starting, moving", this.entities, "entities from", this.source, "to", this.target);
        this.entities.forEach(entity => {
            this.target.addChild(entity);
        });
        logs.log("┕━" + _, `done`);
        // state.logTreeState()
    }
    undo(state) {
        this.entities.forEach(entity => {
            this.source.addChild(entity);
        });
    }
}
//# sourceMappingURL=changeParent.js.map