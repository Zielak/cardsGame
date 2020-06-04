import { applyMixins } from "@cardsgame/utils"

import { Bot } from "../../players/bot"
import { State } from "../../state/state"
import { ConditionAssertions } from "../base/assertions"
import { ConditionBase } from "../base/base"
import { ConditionChainers } from "../base/chainers"
import { Conditions, setFlag } from "../base/conditions"
import { ConditionGrouping } from "../base/grouping"
import { ConditionSubjects } from "../base/subjects"

class BotConditions<S extends State> extends Conditions<S> {
  constructor(state: S, player: Bot) {
    super(state)

    setFlag(this, "player", player)
    setFlag(this, "_constructor", BotConditions)
    setFlag(this, "_constructorArguments", [state])
  }
}

interface BotConditions<S extends State>
  extends Conditions<S>,
    ConditionBase<S>,
    ConditionGrouping<S, BotConditions<S>>,
    ConditionChainers,
    ConditionAssertions,
    ConditionSubjects {}

applyMixins(BotConditions, [
  ConditionBase,
  ConditionGrouping,
  ConditionChainers,
  ConditionAssertions,
  ConditionSubjects,
])

export { BotConditions }
