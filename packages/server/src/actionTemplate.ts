import { Command } from "./command"
import { Conditions } from "./conditions"
import { Player, ServerPlayerEvent } from "./players/player"
import { QuerableProps } from "./queryRunner"
import { State } from "./state/state"

export type InteractionDefinition = QuerableProps | PlayerInteractionCommand

export type ActionTemplate<S extends State> = {
  name: string
  description?: string

  interactions(player: Player): InteractionDefinition[]
  checkConditions: (con: Conditions<S>) => void
  getCommand: (state: S, event: ServerPlayerEvent) => Command
}

export type ActionsSet<S extends State> = Set<ActionTemplate<S>>
