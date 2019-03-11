import { logs } from "./logs"
import { CompositeCommand } from "./commands/compositeCommand"
import { State } from "./state"
import { ICommand, ICommandFactory } from "./command"
import { ServerPlayerEvent } from "./player"

export class CommandsManager {
  history: ICommand[] = []

  currentCommand: ICommand | ICommand[]
  actionPending: boolean = false

  async orderExecution(
    cmdFactory: ICommandFactory,
    state: State,
    event?: ServerPlayerEvent
  ): Promise<boolean> {
    let result = false
    this.actionPending = true
    try {
      let cmd = cmdFactory(state, event)
      if (Array.isArray(cmd)) {
        cmd = new CompositeCommand(cmd)
      }
      this.currentCommand = cmd
      await this.currentCommand.execute(state)

      this.actionPending = false
      this.history.push(cmd)
      result = true
    } catch (e) {
      this.actionPending = false
      logs.error("orderExecution", `command FAILED to execute`, e)
    }
    return result
  }
}
