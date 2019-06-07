const handleChildren = (target, children) => {
  if (!target.children) {
    target.children = []
  }

  const parsedChildren = children.map(stateToJSON)

  target.children.push(...parsedChildren)
}

export const stateToJSON = (state: any) => {
  const result = {}

  for (const prop in state) {
    if (state.hasOwnProperty(prop)) {
      if (prop.startsWith("children")) {
        handleChildren(result, state[prop])
        continue
      }
      if (typeof state[prop] === "object") {
        result[prop] = stateToJSON(state[prop])
        continue
      }
      result[prop] = state[prop]
    }
  }

  return result
}
