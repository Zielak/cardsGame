import { logs } from "../logs";
export class NextPlayer {
    execute(state) {
        const _ = this.constructor.name;
        logs.log(_, "executing");
        const current = state.currentPlayerIdx;
        const next = current + 1 === state.playersCount ? 0 : current + 1;
        state.currentPlayerIdx = next;
        logs.log(_, `now it's ${state.currentPlayer} player turn`);
        // state.logTreeState()
    }
}
//# sourceMappingURL=nextPlayer.js.map