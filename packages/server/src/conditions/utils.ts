export function flag(target, flagName, value?) {
  if (!target._flags) {
    throw new Error(`flag | Incompatible target.`)
  }
  if (arguments.length === 3) {
    target._flags.set(flagName, value)
  } else {
    return target._flags.get(flagName)
  }
}

export function ref(target, refName, value?) {
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
  flag(target, "propParent", undefined)
  flag(target, "propName", undefined)
}

export const resetNegation = (target): void => {
  flag(target, "not", false)
}

/**
 * reset subject back to its default value - the State
 */
export const resetSubject = (target): void => {
  flag(target, "subject", flag(target, "state"))
}

export const postAssertion = (target): void => {
  if (target._propParent) {
    // Reset subject to the object, if we were
    // just asserting its key value
    flag(target, "subject", target._propParent)
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
