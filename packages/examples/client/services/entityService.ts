export const getEntityData = (globalState, idxPath: number[]) => {
  if (!globalState) throw new Error("no state, bro")
  if (!globalState.children) throw new Error("no children here")

  const travel = (path: number[], state) => {
    // Escape invalid path
    if (path.length === 0) return
    if (path.length > 0 && !state.children) return

    const nextIdx = path.pop()

    // Return target child
    if (path.length === 1) {
      // Return data without children
      return state.children[nextIdx]
    }

    // Keep on digging
    return travel(path, state.children[nextIdx])
  }

  travel(idxPath, globalState)
}
