import { ICondition } from "./condition"
import { InteractionDefinition } from "./room"
import { State } from "./state"
import { ServerPlayerEvent } from "./player"
import { ICommand } from "./command"

export type ICommandFactory = (
  state: State,
  event: ServerPlayerEvent
) => ICommand | ICommand[]

export type ActionTemplate = {
  name: string
  parallel?: boolean
  getInteractions(state: State): InteractionDefinition[]
  getConditions(state: State, event?: ServerPlayerEvent): ICondition[]
  getCommands: ICommandFactory
}

export type ActionsSet = Set<ActionTemplate>
