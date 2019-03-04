import { logs } from "./logs"
import { CompositeCommand } from "./commands/compositeCommand"
import { State } from "./state"
import { ICommand, ICommandFactory } from "./command"
import { ServerPlayerEvent } from "./player"

export class CommandsManager {
  history: ICommand[] = []

  orderExecution(
    cmdFactory: ICommandFactory,
    state: State,
    event?: ServerPlayerEvent
  ): boolean {
    let result = false
    try {
      let cmd = cmdFactory(state, event)
      if (Array.isArray(cmd)) {
        cmd = new CompositeCommand(cmd)
      }
      cmd.execute(state)
      this.history.push(cmd)
      result = true
    } catch (e) {
      logs.error("orderExecution", `command FAILED to execute`, e)
    }
    return result
  }
}
