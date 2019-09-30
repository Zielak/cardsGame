export class LocationTrait {
  x: number = 0
  y: number = 0
  angle: number = 0
}

;(LocationTrait as any).typeDef = {
  x: "number",
  y: "number",
  angle: "number"
}
