import { Entity } from "../entity";
export class Container extends Entity {
    constructor() {
        super(...arguments);
        this.isContainer = true;
        this.type = "container";
    }
}
//# sourceMappingURL=container.js.map