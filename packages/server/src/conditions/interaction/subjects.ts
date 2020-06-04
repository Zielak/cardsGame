import { getFlag, resetPropDig, setFlag } from "../base/utils"

class InteractionConditionSubjects {
  /**
   * Changes subject to owner of current entity
   * @yields `player`
   */
  get owner(): this {
    setFlag(this, "subject", getFlag(this, "player").owner)
    resetPropDig(this)

    return this
  }

  /**
   * Changes subject to interacted entity
   * @yields `entity` from players interaction
   */
  get entity(): this {
    setFlag(this, "subject", getFlag(this, "entity"))
    resetPropDig(this)

    return this
  }

  /**
   * Changes subject to interaction data,
   * throws if it wasn't provided by the client.
   * @yields `data` from players interaction
   */
  get data(): this {
    setFlag(this, "subject", getFlag(this, "data"))
    resetPropDig(this)

    return this
  }
}

export { InteractionConditionSubjects }
