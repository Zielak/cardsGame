import { type } from "@colyseus/schema"

export class BoxModelTrait {
  @type("number")
  width: number = 0

  @type("number")
  height: number = 0
}
