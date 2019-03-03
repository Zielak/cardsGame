import { ChangeParent } from "./changeParent";
import { logs } from "../logs";
export class DealCards {
    /**
     * Deals `count` cards from this container to other containers.
     * Eg. hands
     *
     * @param source will take cards from here
     * @param target and put them in these entities
     * @param count how many cards should I deal for each target?
     */
    constructor(source, targets, count = Infinity) {
        this.source = source;
        this.count = count;
        this.targets = Array.isArray(targets) ? targets : [targets];
    }
    execute(state) {
        const _ = this.constructor.name;
        logs.log(_, "executing");
        let i = 0;
        const maxDeals = this.count * this.targets.length;
        const next = () => {
            const card = this.source.top;
            const currentTarget = this.targets[i % this.targets.length];
            // This command thing moves the entity
            new ChangeParent(card, this.source, currentTarget).execute(state);
            i++;
            if (this.source.length > 0 && i < maxDeals) {
                // setTimeout(next, 500)
                next();
            }
            else {
                // resolve(`Deck: Done dealing cards.`)
                logs.log(_, `Done dealing cards.`);
            }
        };
        next();
        state.logTreeState();
    }
}
//# sourceMappingURL=dealCards.js.map