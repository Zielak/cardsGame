import { State } from "../state"
import { logs } from "../logs"
import { ICommand } from "../command"
import { Player } from "../player"
import { map2Array } from "@cardsgame/utils"

export class StartGame implements ICommand {
  execute(state: State) {
    const _ = this.constructor.name
    logs.log(_, "executing")
    state.isGameStarted = true
    state.currentPlayerIdx = 0

    map2Array(state.clients).forEach(clientID => {
      const entity = new Player({
        state: state,
        clientID: clientID,
        parent: state.entities.get(0)
      })

      state.players.add({ clientID, entity })
    })

    const curr = state.currentPlayer

    logs.log(_, `${state.playersCount} players`)
    logs.log(_, `Current player is`, /*curr.entity.name,*/ curr.clientID)
    state.logTreeState()
  }
}
