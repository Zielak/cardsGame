"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var changeParent_1 = require("./changeParent");
var logs_1 = require("../logs");
var DealCards = /** @class */ (function () {
    /**
     * Deals `count` cards from this container to other containers.
     * Eg. hands
     *
     * @param source will take cards from here
     * @param target and put them in these entities
     * @param count how many cards should I deal for each target?
     */
    function DealCards(source, targets, count) {
        if (count === void 0) { count = Infinity; }
        this.source = source;
        this.count = count;
        this.targets = Array.isArray(targets) ? targets : [targets];
    }
    DealCards.prototype.execute = function (state) {
        var _this = this;
        var _ = this.constructor.name;
        logs_1.logs.log(_, "executing");
        var i = 0;
        var maxDeals = this.count * this.targets.length;
        var next = function () {
            var card = _this.source.top;
            var currentTarget = _this.targets[i % _this.targets.length];
            // This command thing moves the entity
            new changeParent_1.ChangeParent(card, _this.source, currentTarget).execute(state);
            i++;
            if (_this.source.length > 0 && i < maxDeals) {
                // setTimeout(next, 500)
                next();
            }
            else {
                // resolve(`Deck: Done dealing cards.`)
                logs_1.logs.log(_, "Done dealing cards.");
            }
        };
        next();
        state.logTreeState();
    };
    return DealCards;
}());
exports.DealCards = DealCards;
//# sourceMappingURL=dealCards.js.map