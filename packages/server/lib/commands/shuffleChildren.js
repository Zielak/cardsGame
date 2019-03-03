import { logs } from "../logs";
import { notifyNewIdx } from "../entityMap";
export class ShuffleChildren {
    constructor(container) {
        this.container = container;
    }
    execute(state) {
        logs.log(`${this.constructor.name}`, "executing");
        let fromIdx = this.container.children.length;
        if (fromIdx === 0)
            return;
        while (--fromIdx) {
            const toIdx = Math.floor(Math.random() * (fromIdx + 1));
            const childi = this.container.children[fromIdx];
            const childj = this.container.children[toIdx];
            this.container.children[fromIdx] = childj;
            this.container.children[toIdx] = childi;
            notifyNewIdx(childi, toIdx);
            notifyNewIdx(childj, fromIdx);
        }
        state.logTreeState();
    }
}
//# sourceMappingURL=shuffleChildren.js.map