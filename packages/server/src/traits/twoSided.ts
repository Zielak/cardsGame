export class TwoSidedTrait {
  faceUp: boolean
}

;(TwoSidedTrait as any).typeDef = {
  faceUp: "boolean"
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
