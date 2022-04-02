import { OwnershipTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { Player } from "../player"
import type { State } from "../state"

import { isChild } from "./child"
import { isParent } from "./parent"

/**
 * Entity with this trait can have a reference to `Player`, who "owns" this entity.
 *
 * @category Trait
 */
export function hasOwnership(entity: unknown): entity is OwnershipTrait {
  return (
    "owner" in (entity as OwnershipTrait) &&
    "ownerID" in (entity as OwnershipTrait)
  )
}

/**
 * @category Trait
 */
export class OwnershipTrait {
  private _owner: Player

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
    if (this._owner) {
      return this._owner
    }
    if (isChild(this)) {
      const parent = this.parent

      if (isParent(parent) && hasOwnership(parent)) {
        return parent.owner
      }
    }
  }

  set owner(value: Player) {
    this._owner = value
    this.ownerID = value ? value.clientID : undefined
  }

  /**
   * ID of the player owning this entity
   * @category OwnershipTrait
   */
  ownerID: string

  /**
   * Is this entity/container to be the main focus for this player?
   * To be used by client-side implementation.
   * @category OwnershipTrait
   */
  ownersMainFocus: boolean
}

OwnershipTrait["typeDef"] = OwnershipTraitTypeDef
OwnershipTrait["trait"] = function constructOwnershipTrait(
  state: State,
  options: Partial<OwnershipTrait> = {}
): void {
  this.owner = def(options.owner, undefined)
  this.ownersMainFocus = def(options.ownersMainFocus, false)
}
