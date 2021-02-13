import { def } from "@cardsgame/utils"

import { Player } from "../players/player"
import { State } from "../state/state"
import { isChild } from "./child"
import { isParent } from "./parent"

export function hasOwnership(entity: unknown): entity is OwnershipTrait {
  return (
    "owner" in (entity as OwnershipTrait) &&
    "ownerID" in (entity as OwnershipTrait)
  )
}

export class OwnershipTrait {
  protected _owner: Player

  /**
   * Get the real owner of this thing, by traversing `this.parent` chain.
   * Owner could be set on an element or container, meaning every element in
   * such container belongs to one owner.
   *
   * @returns `Player` or `undefined` if this container doesn't belong to anyone
   *
   * @memberof OwnershipTrait
   */
  get owner(): Player {
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
   * @memberof OwnershipTrait
   */
  ownerID: string

  /**
   * @memberof OwnershipTrait
   */
  ownersMainFocus: boolean
}

OwnershipTrait["typeDef"] = {
  ownersMainFocus: "boolean",
  ownerID: "string",
}
OwnershipTrait["trait"] = function constructOwnershipTrait(
  state: State,
  options: Partial<OwnershipTrait> = {}
): void {
  this.owner = def(options.owner, undefined)
  this.ownersMainFocus = def(options.ownersMainFocus, false)
}
