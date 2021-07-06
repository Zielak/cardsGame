// TODO: Document all these flags. What is propParent??
type ConditionsFlag =
  | "state"
  | "subject"
  | "initialSubjects"
  | "defaultSubject"
  | "propName"
  // "parent of current prop subject". Cache for current entity subject
  // so we can go back after prop-digging
  | "propParent"
  | "not"
  | "eitherLevel"
  | "_rootReference"

export function getFlag(
  target: Record<string, any>,
  flagName: ConditionsFlag
): any {
  if (!target._flags) {
    throw new Error(`getFlag | Incompatible target.`)
  }
  return target._flags.get(flagName)
}

export function setFlag(
  target: Record<string, any>,
  flagName: ConditionsFlag,
  value: unknown
): void {
  if (!target._flags) {
    throw new Error(`setFlag | Incompatible target.`)
  }
  target._flags.set(flagName, value)
}

/**
 * Get a reference to previously remembered `subject` by the name of `refName`.
 * May be one of the `initialSubjects` or run-time, user-defined references.
 */
export function ref(target: Record<string, any>, refName: string): any
/**
 * Remember a reference to current `subject` by the name `refName`
 */
export function ref(
  target: Record<string, any>,
  refName: string,
  value: unknown
): void
export function ref(
  target: Record<string, any>,
  refName: string,
  value?: unknown
): any {
  if (!target._refs) {
    throw new Error(`ref | Incompatible target.`)
  }
  if (arguments.length === 3) {
    // SET
    if (refName in getFlag(target, "initialSubjects")) {
      throw new Error(
        `Subject named "${refName}" already exists in "initialSubjects". Choose different name.`
      )
    }
    target._refs.set(refName, value)
  }
  // GET
  if (refName in getFlag(target, "initialSubjects")) {
    return getFlag(target, "initialSubjects")[refName]
  }
  return target._refs.get(refName)
}

export function getInitialSubject(
  target: Record<string, any>,
  refName: string
): any {
  return getFlag(target, "initialSubjects")[refName]
}

export const resetPropDig = (target: Record<string, any>): void => {
  setFlag(target, "propParent", undefined)
  setFlag(target, "propName", undefined)
}

export const resetNegation = (target: Record<string, any>): void => {
  setFlag(target, "not", false)
}

/**
 * Reset subject back to its default value
 */
export const resetSubject = (target: Record<string, any>): void => {
  setFlag(target, "subject", getFlag(target, "defaultSubject"))
}

export const postAssertion = (target: Record<string, any>): void => {
  if (getFlag(target, "propParent")) {
    // Reset subject to the object, if we were
    // just asserting its key value
    setFlag(target, "subject", getFlag(target, "propParent"))
    resetPropDig(target)
  }
}

export const iconStyle = (
  bg = "transparent",
  color = "white"
): string => `background: ${bg};
color: ${color};
padding: 0.1em 0.3em;
border-radius: 50%;
width: 1.3em;
height: 1.3em;
text-align: center;
width: 1.2em;
height: 1.2em;`
