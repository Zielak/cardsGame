import { applyMixins } from "@cardsgame/utils"

import { ServerPlayerEvent } from "../player"
import { State } from "../state"

// Conditions
import { ConditionChainers } from "./chainers"
import { getFlag, setFlag } from "./utils"
import { ConditionAssertions } from "./assertions"
import { ConditionBase } from "./base"
import { ConditionGrouping } from "./grouping"
import { ConditionSubjects } from "./subjects"

export { getFlag, setFlag }

export type ConditionsConstructor<S extends State> = new (
  state: S,
  event: ServerPlayerEvent
) => Conditions<S>

class Conditions<S extends State> {
  _flags = new Map<string, any>()
  _refs = new Map<string | symbol, any>()

  constructor(state: S, event: ServerPlayerEvent) {
    setFlag(this, "state", state)
    setFlag(this, "event", event)
    setFlag(this, "player", event.player)
    setFlag(this, "entity", event.entity)
    setFlag(this, "data", event.data)

    setFlag(this, "subject", state)

    setFlag(this, "propName", undefined)
    setFlag(this, "propParent", undefined)
    setFlag(this, "not", false)
    setFlag(this, "eitherLevel", 0)
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
  ConditionSubjects,
])

export { Conditions }
