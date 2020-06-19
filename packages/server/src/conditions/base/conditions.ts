import { getFlag, setFlag } from "./utils"

export { getFlag, setFlag }

class Conditions<S> {
  _flags = new Map<string, any>()
  _refs = new Map<string | symbol, any>()

  constructor(state: S) {
    setFlag(this, "state", state)
    setFlag(this, "subject", state)

    setFlag(this, "propName", undefined)
    setFlag(this, "propParent", undefined)
    setFlag(this, "not", false)
    setFlag(this, "eitherLevel", 0)
  }
}

export { Conditions }
