import { Command } from "./command"
import { Conditions } from "./conditions/conditions"
import { ServerPlayerEvent } from "./player"
import { QuerableProps } from "./queryRunner"
import { State } from "./state/state"

type InteractionDefinition = QuerableProps & { command?: string }

export type ActionTemplate<S extends State> = {
  name: string
  description?: string
  parallel?: boolean

  getInteractions(): InteractionDefinition[]
  getConditions(con: Conditions<S>): void
  getCommands: (state: S, event: ServerPlayerEvent) => Command | Command[]
}

export type ActionsSet<S extends State> = Set<ActionTemplate<S>>
