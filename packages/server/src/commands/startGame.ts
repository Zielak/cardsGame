import { State } from "../state"
import { logs } from "../logs"
import { ICommand } from "../command"
import { Player } from "../player"

export class StartGame implements ICommand {
  execute(state: State) {
    const _ = this.constructor.name
    logs.log(_, "executing")
    state.isGameStarted = true
    state.currentPlayerIdx = 0

    state.clients.toArray().forEach(clientID => {
      const entity = new Player({
        state: state,
        clientID: clientID,
        parent: state.entities.id
      })

      state.players.add({ clientID, entity })
    })

    logs.log(_, `${state.playersCount} players`)
    logs.log(_, `Current player is`, state.currentPlayer)
    state.logTreeState()
  }
}
