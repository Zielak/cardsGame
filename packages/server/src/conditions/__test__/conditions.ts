import type { Player } from "@/player/player.js"
import type { State } from "@/state/state.js"

import { Conditions } from "../conditions.js"
import { ConditionsContextBase } from "../types.js"

type TestConditionInitialSubjects = {
  example: "foo"
  player?: Player
}

type TestConditionsContext<S extends State> = TestConditionInitialSubjects &
  ConditionsContextBase<S>

export type ConditionsTest = Conditions<TestConditionsContext<State>>
