import { Client } from "colyseus"
import { def } from "@cardsgame/utils"
import { Entity, IEntityImplementation, IEntityOptions } from "./entity"

export const BaseCard: IEntityImplementation = (
  entity: Entity,
  options: IBaseCardOptions
) => {
  entity.type = "baseCard"
  entity.visibleToPublic = options.faceUp
  entity.data.faceUp = def(options.faceUp, false)
  entity.data.rotated = def(options.rotated, 0)

  const updateVisibleToPublic = () => {
    entity.visibleToPublic = entity.data.faceUp
  }

  return {
    flip: {
      value: () => {
        entity.data.faceUp = !entity.data.faceUp
        updateVisibleToPublic()
      }
    },
    show: {
      value: () => {
        entity.data.faceUp = true
        updateVisibleToPublic()
      }
    },
    hide: {
      value: () => {
        entity.data.faceUp = false
        updateVisibleToPublic()
      }
    }
  }
}

export interface IBaseCardOptions extends IEntityOptions {
  faceUp?: boolean
  rotated?: number
  marked?: boolean
}

export const faceDownOnlyOwner = (my: Entity, client: any): boolean => {
  // 1. To everyone only if it's faceUp
  // 2. To owner, only if it's in his hands
  return (
    my.data.faceUp ||
    (my.owner.clientID === (client as Client).id &&
      my.parentEntity.type === "hand")
  )
}
