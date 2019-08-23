import { InteractionDefinition } from "./room"
import { State } from "./state"
import { ServerPlayerEvent } from "./player"
import { ICommand } from "./commands"
import { Conditions } from "./conditions"

export type ICommandFactory = (
  state: State,
  event: ServerPlayerEvent
) => ICommand | ICommand[]

export type ActionTemplate<S extends State> = {
  name: string
  description?: string
  parallel?: boolean

  getInteractions(): InteractionDefinition[]
  getConditions(con: Conditions<S>): void
  getCommands: ICommandFactory
}

export type ActionsSet<S extends State> = Set<ActionTemplate<S>>
