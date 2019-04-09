import { float, EntityEvents } from "@cardsgame/utils"
import { Entity, IEntityImplementation, IEntityOptions } from "./entity"

/**
 * Pile's implementation thing
 */
export const Pile: IEntityImplementation = (
  entity: Entity,
  options: IPileOptions
) => {
  const limits = Object.assign(
    {},
    {
      minAngle: -45,
      maxAngle: 45,
      minX: -10,
      minY: -10,
      maxX: 10,
      maxY: 10
    },
    options.limits
  )
  const cardsData = new Map<EntityID, CardsData>()

  entity.type = "pile"
  entity.isContainer = true
  entity.hijacksInteractionTarget = true

  entity.on(EntityEvents.childAdded, (child: Entity) => {
    cardsData.set(child.id, cardsDataFactory(limits))
  })
  entity.on(EntityEvents.childRemoved, (childID: EntityID) => {
    cardsData.delete(childID)
  })

  return {
    restyleChild: {
      value: (child: Entity, idx: number, children: Entity[]) => {
        const { x, y, angle } =
          this.cardsData.get(child.id) || DEFAULT_CARDS_DATA
        return {
          x,
          y,
          angle
        }
      }
    }
  }
}

export interface IPileOptions extends IEntityOptions {
  limits?: PileVisualLimits
}

const cardsDataFactory = (limits): CardsData => {
  return {
    x: float(limits.minX, limits.maxX),
    y: float(limits.minY, limits.maxY),
    angle: float(limits.minAngle, limits.maxAngle)
  }
}

const DEFAULT_CARDS_DATA: CardsData = {
  x: 0,
  y: 0,
  angle: 0
}

interface CardsData {
  angle: number
  x: number
  y: number
}

interface PileVisualLimits {
  minAngle: number
  maxAngle: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}
