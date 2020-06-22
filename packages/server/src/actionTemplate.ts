import { Command } from "./command"
import { InteractionConditions } from "./conditions/interaction"
import { ServerPlayerEvent } from "./players/player"
import { QuerableProps } from "./queryRunner"
import { State } from "./state/state"

export type InteractionDefinition = QuerableProps | PlayerInteractionCommand

export type ActionTemplate<S extends State> = {
  name: string
  description?: string

  interactions(): InteractionDefinition[]
  checkConditions: (con: InteractionConditions<S>) => void
  getCommand: (state: S, event: ServerPlayerEvent) => Command
}

export type ActionsSet<S extends State> = Set<ActionTemplate<S>>
