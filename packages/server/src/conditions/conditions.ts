import { applyMixins } from "@cardsgame/utils"

import { ServerPlayerEvent } from "../player"
import { State } from "../state"

// Conditions
import { ConditionChainers } from "./chainers"
import { flag } from "./utils"
import { ConditionAssertions } from "./assertions"
import { ConditionBase } from "./base"
import { ConditionGrouping } from "./grouping"
import { ConditionSubjects } from "./subjects"

export { flag }

export type ConditionsConstructor<S extends State> = new (
  state: S,
  event: ServerPlayerEvent
) => Conditions<S>

class Conditions<S extends State> {
  _flags = new Map<string, any>()
  _refs = new Map<string | symbol, any>()

  constructor(state: S, event: ServerPlayerEvent) {
    flag(this, "state", state)
    flag(this, "event", event)
    flag(this, "player", event.player)
    flag(this, "entity", event.entity)

    flag(this, "subject", state)

    flag(this, "propName", undefined)
    flag(this, "propParent", undefined)
    flag(this, "not", false)
    flag(this, "eitherLevel", 0)
  }
}

interface Conditions<S extends State>
  extends ConditionBase<S>,
    ConditionGrouping<S>,
    ConditionChainers,
    ConditionAssertions,
    ConditionSubjects {}

applyMixins(Conditions, [
  ConditionBase,
  ConditionGrouping,
  ConditionChainers,
  ConditionAssertions,
  ConditionSubjects
])

export { Conditions }
