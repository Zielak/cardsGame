import type { State } from "@/state/state.js"

import type { CustomConditionError } from "./errors.js"

interface ConditionsFlags {
  /**
   * reference to state object
   */
  state: State
  /**
   * reference to or value of current subject
   */
  subject: unknown
  initialSubjects: Record<string, any>
  defaultSubject: unknown
  propName: string
  /**
   * "parent of current prop subject". Cache for current entity subject
   * so we can go back after assertions
   */
  currentParent: unknown
  /**
   * Error message passed when invoking test()
   */
  customError: CustomConditionError
  /**
   * Was the "not" used along the chain
   */
  not: boolean
  eitherLevel: number
  _rootReference: unknown
}

/**
 * @ignore
 */
export function getFlag<T extends keyof ConditionsFlags>(
  target: Record<string, any>,
  flagName: T,
): ConditionsFlags[T] {
  if (!target._flags) {
    throw new Error(`getFlag | Incompatible target.`)
  }
  return target._flags.get(flagName)
}

/**
 * Remember some value internally for this Conditions run
 * @ignore
 */
export function setFlag(
  target: Record<string, any>,
  flagName: keyof ConditionsFlags,
  value: unknown,
): void {
  if (!target._flags) {
    throw new Error(`setFlag | Incompatible target.`)
  }
  target._flags.set(flagName, value)
}

/**
 * Get a reference to previously remembered `subject` by the name of `refName`.
 * Only run-time, user-defined references.
 * @ignore
 */
export function getRef(target: Record<string, any>, refName: string): unknown {
  if (!target._refs) {
    throw new Error(`ref | Incompatible target.`)
  }

  return target._refs.get(refName)
}

/**
 * Remember a reference to current `subject` by the name `refName`
 * @ignore
 */
export function setRef(
  target: Record<string, any>,
  refName: string,
  value: unknown,
): void {
  if (!target._refs) {
    throw new Error(`ref | Incompatible target.`)
  }

  if (refName in getFlag(target, "initialSubjects")) {
    throw new Error(
      `Subject named "${refName}" already exists in "initialSubjects". Choose different name.`,
    )
  }
  target._refs.set(refName, value)
}

/**
 * @ignore
 */
export function getInitialSubject<T>(
  target: Record<string, any>,
  refName: string,
): T {
  return getFlag(target, "initialSubjects")[refName]
}

/**
 * @ignore
 */
export const resetPropDig = (target: Record<string, any>): void => {
  setFlag(target, "currentParent", undefined)
  setFlag(target, "propName", undefined)
}

/**
 * @ignore
 */
export const resetNegation = (target: Record<string, any>): void => {
  setFlag(target, "not", false)
}

/**
 * Reset subject back to its default value
 * @ignore
 */
export const resetSubject = (target: Record<string, any>): void => {
  setFlag(target, "subject", getFlag(target, "defaultSubject"))
}

/**
 * @ignore
 */
export const postAssertion = (target: Record<string, any>): void => {
  if (getFlag(target, "currentParent")) {
    // Reset subject to the parent, if we were
    // just asserting its key value
    setFlag(target, "subject", getFlag(target, "currentParent"))
    setFlag(target, "currentParent", undefined)
    setFlag(target, "propName", undefined)
  }
}
