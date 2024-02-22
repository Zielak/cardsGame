import { OwnershipTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { Player } from "../player/player.js"
import type { State } from "../state/state.js"

import { isChild } from "./child.js"
import { isParent } from "./parent.js"

/**
 * @category Ownership
 */
export function hasOwnership(entity: unknown): entity is OwnershipTrait {
  return (
    "owner" in (entity as OwnershipTrait) &&
    "ownerID" in (entity as OwnershipTrait)
  )
}

/**
 * Entity with this trait can have a reference to `Player`, who "owns" this entity.
 *
 * @category Trait
 */
export class OwnershipTrait {
  /**
   * ID of the player owning this entity. Synced with client-side and automatically parsed after changing `entity.owner` from the server-side.
   * @category OwnershipTrait
   */
  ownerID: string

  private $_owner: Player

  /**
   * Get the real owner of this thing, by traversing `this.parent` chain.
   * Owner could be set on an element or container, meaning every element in
   * such container belongs to one owner.
   *
   * @returns `Player` or `undefined` if this container doesn't belong to anyone
   *
   * @category OwnershipTrait
   */
  get owner(): Player | undefined {
    if (this.$_owner) {
      return this.$_owner
    }
    if (isChild(this)) {
      const parent = this.parent

      if (isParent(parent) && hasOwnership(parent)) {
        return parent.owner
      }
    }
  }

  set owner(newOwner: Player) {
    if (this.$_ownersMainFocus) {
      // Release previous owner from this as main focus
      this.$_owner.hasEntityInMainFocus = false
    }

    this.$_owner = newOwner
    this.ownerID = newOwner ? newOwner.clientID : undefined

    if (this.$_ownersMainFocus && newOwner) {
      // Apply main focus on the new owner
      newOwner.hasEntityInMainFocus = true
    }
  }

  private $_ownersMainFocus = false

  /**
   * Is this entity/container to be the main focus for this player?
   * To be used by client-side implementation.
   * @category OwnershipTrait
   */
  get ownersMainFocus(): boolean {
    return this.$_ownersMainFocus
  }

  set ownersMainFocus(newValue: boolean) {
    // console.log("$ ownersMainFocus setter", newValue)
    this.$_ownersMainFocus = newValue

    if (this.$_owner) {
      this.$_owner.hasEntityInMainFocus = newValue
    }
  }
}

OwnershipTrait["typeDef"] = OwnershipTraitTypeDef
OwnershipTrait["trait"] = function constructOwnershipTrait(
  this: OwnershipTrait,
  state: State,
  options: Partial<OwnershipTrait> = {},
): void {
  this.owner = def(options.owner, undefined)
  this.ownersMainFocus = def(options.ownersMainFocus, false)

  if (this.owner && this.ownersMainFocus) {
    this.owner.hasEntityInMainFocus = this.ownersMainFocus
  }
}
