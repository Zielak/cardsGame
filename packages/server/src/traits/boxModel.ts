export class BoxModelTrait {
  width: number = 0
  height: number = 0
}

;(BoxModelTrait as any).typeDef = { height: "number", width: "number" }
