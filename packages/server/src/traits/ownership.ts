import { type } from "@colyseus/schema"
import { def } from "@cardsgame/utils"
import { Player } from "../player"
import { State } from "../state"
import { getParentEntity, isChild } from "./child"
import { isParent } from "./parent"

export function hasOwnership(entity: any): entity is OwnershipTrait {
  return (
    typeof (entity as OwnershipTrait).owner !== "undefined" &&
    typeof (entity as OwnershipTrait).ownerID !== "undefined"
  )
}

export class OwnershipTrait {
  owner: Player

  @type("string")
  ownerID: string

  @type("boolean")
  isInOwnersView: boolean
}

OwnershipTrait.constructor = (
  entity: OwnershipTrait,
  state: State,
  options: Partial<OwnershipTrait> = {}
) => {
  entity.owner = def(options.owner, undefined)
  entity.ownerID = def(entity.owner && entity.owner.clientID, undefined)
  entity.isInOwnersView = def(options.isInOwnersView, false)
}

/**
 * Get the real owner of this thing, by traversing `this.parent` chain.
 * Owner could be set on an element or container, meaning every element in
 * such container belongs to one owner.
 *
 * @returns `Player` or `undefined` if this container doesn't belong to anyone
 */
export function getOwner(state: State, entity): Player {
  if (!hasOwnership(entity)) {
    return
  }
  if (entity.owner) {
    return entity.owner
  }
  if (isChild(entity)) {
    const parent = getParentEntity(state, entity)

    if (isParent(parent) && hasOwnership(parent)) {
      if (parent.owner) {
        return parent.owner
      }
      return getOwner(state, parent)
    }
  }
}
