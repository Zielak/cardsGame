import { logs } from "../logs";
export class PreviousPlayer {
    execute(state) {
        // TODO: move these logs outside...
        const _ = this.constructor.name;
        logs.log(_, "executing");
        const current = state.currentPlayerIdx;
        const next = current - 1 === -1 ? state.playersCount - 1 : current - 1;
        state.currentPlayerIdx = next;
        logs.log(_, `now it's ${state.currentPlayer} player turn`);
        // state.logTreeState()
    }
}
//# sourceMappingURL=previousPlayer.js.map