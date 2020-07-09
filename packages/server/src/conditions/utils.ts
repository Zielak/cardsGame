type ConditionsFlag =
  | "state"
  | "subject"
  | "initialSubjects"
  | "defaultSubject"
  | "propName"
  | "propParent"
  | "not"
  | "eitherLevel"
  | "_constructor"
  | "_constructorArguments"

export function getFlag(target, flagName: ConditionsFlag): any {
  if (!target._flags) {
    throw new Error(`getFlag | Incompatible target.`)
  }
  return target._flags.get(flagName)
}

export function setFlag(target, flagName: ConditionsFlag, value: any): void {
  if (!target._flags) {
    throw new Error(`setFlag | Incompatible target.`)
  }
  target._flags.set(flagName, value)
}

/**
 * Get a reference to previously remembered `subject` by the name of `refName`
 */
export function ref(target, refName: string): any
/**
 * Remember a reference to current `subject` by the name `refName`
 */
export function ref(target, refName: string, value: any): void
export function ref(target, refName: string, value?: any): any {
  if (!target._refs) {
    throw new Error(`ref | Incompatible target.`)
  }
  if (arguments.length === 3) {
    target._refs.set(refName, value)
  } else {
    return target._refs.get(refName)
  }
}

export const cloneConditions = <C>(con: any): C => {
  const Constr = getFlag(con, "_constructor")
  const args = getFlag(con, "_constructorArguments")
  const newCon = new Constr(...args)

  con._flags.forEach((value, key) => newCon._flags.set(key, value))

  return newCon
}

export const resetPropDig = (target): void => {
  setFlag(target, "propParent", undefined)
  setFlag(target, "propName", undefined)
}

export const resetNegation = (target): void => {
  setFlag(target, "not", false)
}

/**
 * Reset subject back to its default value
 */
export const resetSubject = (target): void => {
  setFlag(target, "subject", getFlag(target, getFlag(target, "defaultSubject")))
}

export const postAssertion = (target): void => {
  if (target._propParent) {
    // Reset subject to the object, if we were
    // just asserting its key value
    setFlag(target, "subject", target._propParent)
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
