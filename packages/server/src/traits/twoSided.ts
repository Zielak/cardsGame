export class TwoSidedTrait {
  faceUp: boolean

  flip() {
    this.faceUp = !this.faceUp
  }

  flipUp() {
    this.faceUp = true
  }

  flipDown() {
    this.faceUp = false
  }
}

;(TwoSidedTrait as any).typeDef = {
  faceUp: "boolean"
}
