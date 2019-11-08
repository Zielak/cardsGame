import { State } from "../state"
import { Room } from "../room"

export * from "./changeParent"
export * from "./compositeCommand"
export * from "./dealCards"
export * from "./nextPlayer"
export * from "./noop"
export * from "./previousPlayer"
export * from "./shuffleChildren"
export * from "./twoSided"

export interface ICommand {
  _name?: string
  execute(state: State, room: Room<any>): void
  undo?(state: State, room: Room<any>)
}
