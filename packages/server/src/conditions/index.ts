import { applyMixins } from "@cardsgame/utils"

import type { QuerableProps } from "../queryRunner"

import { ConditionAssertions } from "./assertions"
import { ConditionBase } from "./base"
import { ConditionChainers } from "./chainers"
import { ConditionGrouping } from "./grouping"
import { ConditionSubjects } from "./subjects"
import { getFlag, resetSubject, setFlag } from "./utils"

export interface ConditionsMethods<S, C extends Conditions<S, C>>
  extends ConditionBase<S>,
    ConditionGrouping<S, C>,
    ConditionChainers,
    ConditionAssertions,
    ConditionSubjects {}

export class ConditionsMethods<S, C extends Conditions<S, C>> {
  protected _flags = new Map<string, any>()
  protected _refs = new Map<string, any>()
}

abstract class Conditions<S, C extends Conditions<S, C>> extends Function {
  /**
   * @param state game's state reference
   * @param subjects additional data to be available while running conditions
   * @param defaultSubject which of the initial subjects to pick back after each assertion? If left empty, `state` will be picked instead.
   */
  constructor(
    state: S,
    subjects: Record<string, any>,
    defaultSubjectKey?: string
  ) {
    super()
    const core = new ConditionsMethods<S, C>()

    setFlag(core, "state", state)

    const proxy = new Proxy<Conditions<S, C>>(this, {
      apply: function (target, thisArg, args): ConditionsMethods<S, C> {
        resetSubject(core)
        if (args && args.length > 0) {
          return core["get"].apply(core, args)
        } else {
          return core
        }
      },
      get: function (target, prop: string, receiver): ConditionsMethods<S, C> {
        // Confirm it's at "initialSubjects"
        const newSub = getFlag(core, "initialSubjects")[prop]
        if (!newSub) {
          throw new Error(
            `There's no initial subject called "${prop.toString()}".`
          )
        }
        setFlag(core, "subject", newSub)
        return core
      },
    })

    if (defaultSubjectKey) {
      if (!(defaultSubjectKey in subjects)) {
        throw new Error(
          `Can't set default subject. "${defaultSubjectKey}" does not exist in initial subjects.`
        )
      }
      setFlag(core, "subject", subjects[defaultSubjectKey])
    } else {
      setFlag(core, "subject", state)
    }
    setFlag(core, "initialSubjects", Object.assign({}, subjects))
    setFlag(core, "defaultSubject", subjects[defaultSubjectKey] || state)

    setFlag(core, "propName", undefined)
    setFlag(core, "propParent", undefined)
    setFlag(core, "not", false)
    setFlag(core, "eitherLevel", 0)

    setFlag(core, "_rootReference", proxy)

    return proxy
  }
}

interface Conditions<S, C extends Conditions<S, C>> {
  /**
   *
   */
  (): ConditionsMethods<S, C>
  /**
   * Looks for a child entity by their `props`, starting from current subject.
   *
   * @yields an entity, found by alias or `QuerableProps` query
   * @example ```
   * con({name: 'deck'}).as('deck')
   * ```
   */
  (props: QuerableProps): ConditionsMethods<S, C>
  /**
   * Changes subject to previously remembered entity by an `alias`.
   * If `props` are also provided, it'll also search the aliased entity
   * for another entity by their `props`.
   *
   * @yields an entity, found by alias or `QuerableProps` query
   * @example ```
   * con('deck', {rank: 'K'})
   * ```
   */
  (alias: string, props?: QuerableProps): ConditionsMethods<S, C>
  (arg0?: string | QuerableProps, arg1?: QuerableProps): ConditionsMethods<S, C>
}

applyMixins(ConditionsMethods, [
  ConditionBase,
  ConditionGrouping,
  ConditionChainers,
  ConditionAssertions,
  ConditionSubjects,
])

export { Conditions }
