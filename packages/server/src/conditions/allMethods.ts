/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { State } from "@/state/state.js"

import { ConditionAssertions } from "./assertions.js"
import { ConditionBase } from "./base.js"
import { ConditionChainers } from "./chainers.js"
import { ConditionGrouping } from "./grouping.js"
import { ConditionSubjects } from "./subjects.js"
import { ConditionsContextBase } from "./types.js"

export interface ConditionsMethods<
  Context extends ConditionsContextBase<S>,
  S extends State = Context["state"],
> extends ConditionBase<S>,
    ConditionGrouping<Context, S>,
    ConditionChainers,
    ConditionAssertions<Context, S>,
    ConditionSubjects<Context, S> {}

export class ConditionsMethods<
  Context extends ConditionsContextBase<S>,
  S extends State = Context["state"],
> {
  protected _flags = new Map<string, any>()
  protected _refs = new Map<string, any>()
}
