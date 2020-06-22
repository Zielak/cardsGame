import { hasOwnership } from "../../traits/ownership"
import { assert } from "../base/assertions"
import { getFlag } from "../base/utils"

class InteractionConditionAssertions {
  // === Assertions which ignore current subject ===

  /**
   * @asserts that player is interacting with an entity which belongs to them
   */
  playerOwnsThisEntity(): this {
    const entity = getFlag(this, "entity")
    const player = getFlag(this, "player")

    if (hasOwnership(entity)) {
      const expected = entity.owner

      assert.call(
        this,
        player === expected,
        `Player "#{act}" is not an owner.`,
        `Player "#{act}" is an owner, but shouldn't`,
        expected && expected.clientID,
        hasOwnership(entity) ? entity.owner.clientID : undefined
      )
    } else {
      throw new Error(`Given entity is not ownable.`)
    }

    return this
  }
}

export { InteractionConditionAssertions }
