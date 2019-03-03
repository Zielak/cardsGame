import { State } from "./state"
import { PlayerEvent } from "./player"

export interface ICommand {
  execute(state: State)
  undo?(state: State)
}
export type ICommandFactory = (
  state: State,
  event: PlayerEvent
) => ICommand | ICommand[]
