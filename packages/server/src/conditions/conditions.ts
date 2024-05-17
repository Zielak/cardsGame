/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { applyMixins } from "@cardsgame/utils"

import { logs } from "../logs.js"
import type { State } from "../state/state.js"

import { ConditionsMethods } from "./allMethods.js"
import { ConditionAssertions } from "./assertions.js"
import { ConditionBase } from "./base.js"
import { ConditionChainers } from "./chainers.js"
import { ConditionGrouping } from "./grouping.js"
import { ConditionSubjects } from "./subjects.js"
import { ConditionsContextBase } from "./types.js"
import { getFlag, resetPropDig, resetSubject, setFlag } from "./utils.js"

class Conditions<
  Context extends ConditionsContextBase<S>,
  S = Context["state"],
> extends Function {
  /**
   * @param state game's state reference
   * @param subjects additional data to be available while running conditions
   * @param defaultSubject which of the initial subjects to pick back after each assertion? If left empty, `state` will be picked instead.
   */
  constructor(context: Context, defaultSubjectKey?: keyof Context) {
    super()
    const core = new ConditionsMethods<Context, S>()

    function API(customError): ConditionsMethods<Context, S> {
      resetSubject(core)
      resetPropDig(core)

      if (getFlag(core, "eitherLevel") === 0) {
        // It might be empty, good, reset it to undefined
        if (customError) {
          logs.debug("#Conditions, setting customError:", customError)
        }
        if (getFlag(core, "customError")) {
          logs.debug("#Conditions, overwriting previous error")
        }
        setFlag(core, "customError", customError)
      }

      return core
    }
    API.getCore = () => core

    setFlag(core, "state", context.state)

    if (defaultSubjectKey) {
      if (!(defaultSubjectKey in context)) {
        throw new Error(
          `Can't set default subject. "${String(
            defaultSubjectKey,
          )}" does not exist in initial subjects.`,
        )
      }
      setFlag(core, "subject", context[defaultSubjectKey])
    } else {
      setFlag(core, "subject", context.state)
    }
    setFlag(core, "initialSubjects", Object.assign({}, context))
    setFlag(core, "defaultSubject", context[defaultSubjectKey] || context.state)

    setFlag(core, "propName", undefined)
    setFlag(core, "currentParent", undefined)
    setFlag(core, "not", false)
    setFlag(core, "eitherLevel", 0)

    setFlag(core, "_rootReference", API)

    return API
  }
}

interface Conditions<
  Context extends ConditionsContextBase<S>,
  S extends State = Context["state"],
> {
  /**
   * Provide custom error message. It will be sent to the client when one
   * of the assertions fail in given chain.
   *
   * > TODO: it would be nice to have an object or error code sent to client additionally.
   * > Front-end could then have it pick the message in player's language
   *
   * @example
   * ```ts
   * test("Wait for your turn!").itsPlayersTurn()
   * test("Can't perform this action until round 5").its("round").is.aboveEq(5)
   * ```
   */
  (errorMessage?: string): ConditionsMethods<Context, S>

  /**
   * For internal use only. Get direct reference to the core, without having to
   * call the Conditions function
   * @ignore
   */
  getCore(): ConditionsMethods<Context, S>
}

applyMixins(ConditionsMethods, [
  ConditionBase,
  ConditionGrouping,
  ConditionChainers,
  ConditionAssertions,
  ConditionSubjects,
])

export { Conditions }
