import { type } from "@colyseus/schema"

export class TwoSidedTrait {
  @type("boolean")
  faceUp: boolean
}

export function flip(entity: TwoSidedTrait) {
  entity.faceUp = !entity.faceUp
}

export function faceUp(entity: TwoSidedTrait) {
  entity.faceUp = true
}

export function faceDown(entity: TwoSidedTrait) {
  entity.faceUp = false
}
