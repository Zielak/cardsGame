import { ICondition } from "./conditions"
import { InteractionDefinition } from "./room"
import { State } from "./state"
import { ServerPlayerEvent } from "./player"
import { ICommand } from "./commands"

export type ICommandFactory = (
  state: State,
  event: ServerPlayerEvent
) => ICommand | ICommand[]

export type ActionTemplate = {
  name: string
  description?: string
  parallel?: boolean

  getInteractions(): InteractionDefinition[]
  getConditions(state: State, event?: ServerPlayerEvent): ICondition[]
  getCommands: ICommandFactory
}

export type ActionsSet = Set<ActionTemplate>
