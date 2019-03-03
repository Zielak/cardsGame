import { nosync } from "colyseus"
import { float } from "@cardsgame/utils"
import { Entity, IEntityOptions } from "../entity"
import { Container } from "./container"

export class Pile extends Container {
  type = "pile"
  hijacksInteractionTarget = true

  @nosync
  limits: PileVisualLimits
  @nosync
  cardsData = new Map<EntityID, CardsData>()

  constructor(options: IPileOptions) {
    super(options)

    this.limits = Object.assign(
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
  }

  onChildAdded(child: Entity) {
    this.cardsData.set(child.id, cardsDataFactory(this.limits))
  }
  onChildRemoved(childID: EntityID) {
    this.cardsData.delete(childID)
  }

  restyleChild(child: Entity, idx: number, children: Entity[]) {
    const { x, y, angle } = this.cardsData.get(child.id) || DEFAULT_CARDS_DATA
    return {
      x,
      y,
      angle
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
