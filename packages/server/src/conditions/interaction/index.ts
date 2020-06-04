import { applyMixins } from "@cardsgame/utils"

import { ServerPlayerEvent } from "../../players/player"
import { ConditionAssertions } from "../base/assertions"
import { ConditionBase } from "../base/base"
import { ConditionChainers } from "../base/chainers"
import { Conditions, setFlag } from "../base/conditions"
import { ConditionGrouping } from "../base/grouping"
import { ConditionSubjects } from "../base/subjects"
import { InteractionConditionAssertions } from "./assertions"
import { InteractionConditionBase } from "./base"
import { InteractionConditionSubjects } from "./subjects"

class InteractionConditions<S> extends Conditions<S> {
  constructor(state: S, event: ServerPlayerEvent) {
    super(state)
    setFlag(this, "event", event)
    setFlag(this, "player", event.player)
    setFlag(this, "entity", event.entity)
    setFlag(this, "data", event.data)

    setFlag(this, "_constructor", InteractionConditions)
    setFlag(this, "_constructorArguments", [state, event])
  }
}

interface InteractionConditions<S>
  extends ConditionBase<S>,
    InteractionConditionBase,
    ConditionGrouping<S, InteractionConditions<S>>,
    ConditionChainers,
    ConditionAssertions,
    InteractionConditionAssertions,
    ConditionSubjects,
    InteractionConditionSubjects {}

applyMixins(InteractionConditions, [
  ConditionBase,
  InteractionConditionBase,
  ConditionGrouping,
  ConditionChainers,
  ConditionAssertions,
  InteractionConditionAssertions,
  ConditionSubjects,
  InteractionConditionSubjects,
])

export { InteractionConditions }
