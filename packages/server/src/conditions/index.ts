import { applyMixins } from "@cardsgame/utils"

import { ConditionAssertions } from "./assertions"
import { ConditionBase } from "./base"
import { ConditionChainers } from "./chainers"
import { ConditionGrouping } from "./grouping"
import { ConditionSubjects } from "./subjects"
import { ref, resetSubject, setFlag } from "./utils"

class Conditions<S, P = Record<string, any>> extends Function {
  _flags = new Map<string, any>()
  _refs = new Map<string | keyof P, any>()

  _log: string

  /**
   * @param state
   * @param props Additional data to be available while running conditions
   * @param defaultSubject which subject to pick back after each assertion? `"state"` is the default.
   */
  constructor(state: S, subjects: P, defaultSubject?: keyof P) {
    super("failReason")
    setFlag(this, "state", state)

    const proxy = new Proxy<Conditions<S, P>>(this, {
      apply: function (target, thisArg, args): any {
        target._setLog(args[0])
        return target
      },
      get: function (target, prop, receiver) {
        resetSubject(target)
        return target[prop]
      },
    })

    this.ref = {} as any
    Object.keys(subjects).forEach((refName) => {
      // Remember given subjects by ref
      ref(this, refName, subjects[refName])

      Object.defineProperty(this.ref, refName, {
        get: function (): Conditions<S, P> {
          setFlag(proxy, "subject", ref(proxy, refName))
          return proxy
        },
      })
    })

    if (defaultSubject) {
      setFlag(this, "subject", subjects[defaultSubject])
    } else {
      setFlag(this, "subject", state)
    }
    setFlag(this, "initialSubjects", Object.keys(subjects))
    setFlag(this, "defaultSubject", defaultSubject || "state")

    setFlag(this, "propName", undefined)
    setFlag(this, "propParent", undefined)
    setFlag(this, "not", false)
    setFlag(this, "eitherLevel", 0)

    setFlag(this, "_constructor", Conditions)
    setFlag(this, "_constructorArguments", [state, subjects, defaultSubject])

    return proxy
  }

  protected _setLog(log: string): void {
    this._log = log
  }
}

interface Conditions<S, P>
  extends ConditionBase<S>,
    ConditionGrouping<S, P, Conditions<S, P>>,
    ConditionChainers,
    ConditionAssertions,
    ConditionSubjects {
  /**
   * Changes subject to one of the initially provided objects
   */
  ref: { state: Conditions<S, P> } & { [prop in keyof P]: Conditions<S, P> }
  (failReason: string): Conditions<S, P>
}

applyMixins(Conditions, [
  ConditionBase,
  ConditionGrouping,
  ConditionChainers,
  ConditionAssertions,
  ConditionSubjects,
])

export { Conditions }
