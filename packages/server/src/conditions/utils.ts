type ConditionsFlag =
  | "state"
  | "event"
  | "player"
  | "entity"
  | "data"
  | "subject"
  | "propName"
  | "propParent"
  | "not"
  | "eitherLevel"

export function getFlag(target, flagName: ConditionsFlag): any {
  if (!target._flags) {
    throw new Error(`flag | Incompatible target.`)
  }
  return target._flags.get(flagName)
}

export function setFlag(target, flagName: ConditionsFlag, value: any): void {
  if (!target._flags) {
    throw new Error(`flag | Incompatible target.`)
  }
  target._flags.set(flagName, value)
}

export function ref(target, refName, value?): any {
  if (!target._refs) {
    throw new Error(`ref | Incompatible target.`)
  }
  if (arguments.length === 3) {
    target._refs.set(refName, value)
  } else {
    return target._refs.get(refName)
  }
}

export const resetPropDig = (target): void => {
  setFlag(target, "propParent", undefined)
  setFlag(target, "propName", undefined)
}

export const resetNegation = (target): void => {
  setFlag(target, "not", false)
}

/**
 * reset subject back to its default value - the State
 */
export const resetSubject = (target): void => {
  setFlag(target, "subject", getFlag(target, "state"))
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
