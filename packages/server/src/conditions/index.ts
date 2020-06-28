import { CallableInstance } from "callable-instance"

import { applyMixins } from "@cardsgame/utils"

import { ServerPlayerEvent } from "../players/player"
import { ConditionAssertions } from "./assertions"
import { ConditionBase } from "./base"
import { ConditionChainers } from "./chainers"
import { ConditionGrouping } from "./grouping"
import { ConditionSubjects } from "./subjects"
import { setFlag } from "./utils"

class Conditions<S> extends CallableInstance<Conditions<S>> {
  _flags = new Map<string, any>()
  _refs = new Map<string | symbol, any>()

  _log: string

  constructor(state: S, event: ServerPlayerEvent) {
    super("_setLog")
    setFlag(this, "state", state)
    setFlag(this, "subject", state)

    setFlag(this, "event", event)
    setFlag(this, "player", event.player)
    setFlag(this, "entity", event.entity)
    setFlag(this, "data", event.data)

    setFlag(this, "propName", undefined)
    setFlag(this, "propParent", undefined)
    setFlag(this, "not", false)
    setFlag(this, "eitherLevel", 0)

    setFlag(this, "_constructor", Conditions)
    setFlag(this, "_constructorArguments", [state, event])
  }

  protected _setLog(log: string): void {
    this._log = log
  }
}

interface Conditions<S>
  extends ConditionBase<S>,
    ConditionGrouping<S, Conditions<S>>,
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
