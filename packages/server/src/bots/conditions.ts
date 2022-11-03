import { Conditions } from "../conditions/conditions.js"
import type { Bot } from "../player/bot.js"
import type { State } from "../state/state.js"
import type { ChildTrait } from "../traits/child.js"

export class BotConditions<S extends State> extends Conditions<
  S,
  { player: Bot }
> {}

export class EntityConditions<S extends State> extends Conditions<
  S,
  { entity: ChildTrait }
> {}
