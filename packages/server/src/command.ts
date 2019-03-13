import { State } from "./state"

export interface ICommand {
  execute(state: State): Promise<void> | void
  undo?(state: State)
}
