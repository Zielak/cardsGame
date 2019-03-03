import { logs } from "../logs";
export class StartGame {
    execute(state) {
        const _ = this.constructor.name;
        logs.log(_, "executing");
        state.isGameStarted = true;
        state.currentPlayerIdx = 0;
        logs.log(_, `${state.playersCount} players`);
        logs.log(_, `Current player is`, state.currentPlayer);
        state.logTreeState();
    }
}
//# sourceMappingURL=startGame.js.map