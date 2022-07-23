import { applyMixins, logs } from "@cardsgame/utils"

import type { State } from "../state"

import { ConditionAssertions } from "./assertions"
import { ConditionBase } from "./base"
import { ConditionChainers } from "./chainers"
import { ConditionGrouping } from "./grouping"
import { ConditionSubjects } from "./subjects"
import { getFlag, resetPropDig, resetSubject, setFlag } from "./utils"

export interface ConditionsMethods<S extends State, I = Record<string, any>>
  extends ConditionBase<S>,
    ConditionGrouping<S, I>,
    ConditionChainers,
    ConditionAssertions,
    ConditionSubjects<I> {}

export class ConditionsMethods<S, I = Record<string, any>> {
  protected _flags = new Map<string, any>()
  protected _refs = new Map<string, any>()
}

abstract class Conditions<
  S extends State,
  InitialSubjects = Record<string, any>
> extends Function {
  /**
   * @param state game's state reference
   * @param subjects additional data to be available while running conditions
   * @param defaultSubject which of the initial subjects to pick back after each assertion? If left empty, `state` will be picked instead.
   */
  constructor(
    state: S,
    subjects: InitialSubjects,
    defaultSubjectKey?: keyof InitialSubjects
  ) {
    super()
    const core = new ConditionsMethods<S, InitialSubjects>()

    function API(customError): ConditionsMethods<S, InitialSubjects> {
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

    setFlag(core, "state", state)

    if (defaultSubjectKey) {
      if (!(defaultSubjectKey in subjects)) {
        throw new Error(
          `Can't set default subject. "${String(
            defaultSubjectKey
          )}" does not exist in initial subjects.`
        )
      }
      setFlag(core, "subject", subjects[defaultSubjectKey])
    } else {
      setFlag(core, "subject", state)
    }
    setFlag(core, "initialSubjects", Object.assign({}, subjects))
    setFlag(core, "defaultSubject", subjects[defaultSubjectKey] || state)

    setFlag(core, "propName", undefined)
    setFlag(core, "currentParent", undefined)
    setFlag(core, "not", false)
    setFlag(core, "eitherLevel", 0)

    setFlag(core, "_rootReference", API)

    return API
  }
}

interface Conditions<S, InitialSubjects = Record<string, any>> {
  /**
   * Provide custom error message. It will be sent to the client when one
   * of the assertions fail in given chain.
   *
   * > TODO: it would be nice to have an object or error code sent to client additionally.
   * > Front-end could then have it pick the message in player's language
   *
   * @example
   * ```ts
   * con("Wait for your turn!").itsPlayersTurn()
   * con("Can't perform this action until round 5").its("round").is.aboveEq(5)
   * ```
   */
  (errorMessage?: string): ConditionsMethods<S, InitialSubjects>

  /**
   * For internal use only. Get direct reference to the core, without having to
   * call the Conditions function
   * @ignore
   */
  getCore(): ConditionsMethods<S, InitialSubjects>
}

applyMixins(ConditionsMethods, [
  ConditionBase,
  ConditionGrouping,
  ConditionChainers,
  ConditionAssertions,
  ConditionSubjects,
])

export { Conditions }
