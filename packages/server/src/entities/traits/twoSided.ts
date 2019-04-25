export interface ITwoSided {
  faceUp: boolean
}

export function flip(entity: ITwoSided) {
  entity.faceUp = !entity.faceUp
}

export function faceUp(entity: ITwoSided) {
  entity.faceUp = true
}

export function faceDown(entity: ITwoSided) {
  entity.faceUp = false
}
