import { Conditions } from "../conditions"
import type { Bot } from "../player"
import type { State } from "../state"
import type { ChildTrait } from "../traits"

export class BotConditions<S extends State> extends Conditions<
  S,
  { player: Bot }
> {}

export class EntityConditions<S extends State> extends Conditions<
  S,
  { entity: ChildTrait }
> {}
