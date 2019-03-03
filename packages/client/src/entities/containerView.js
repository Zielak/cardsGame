import { EntityView } from "./entityView";
export class ContainerView extends EntityView {
    constructor() {
        super(...arguments);
        this.isContainer = true;
        // You can only click the topmost entity in this container
        this.disablesTargetingChildren = true;
    }
}
//# sourceMappingURL=containerView.js.map