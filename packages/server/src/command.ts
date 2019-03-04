import { State } from "./state"
import { ServerPlayerEvent } from "./player"

export interface ICommand {
  execute(state: State)
  undo?(state: State)
}
export type ICommandFactory = (
  state: State,
  event: ServerPlayerEvent
) => ICommand | ICommand[]
