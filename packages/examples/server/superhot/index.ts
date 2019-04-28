import { Room, ActionTemplate } from "@cardsgame/server"
import { SuperhotState } from "./state"

export class SuperhotRoom extends Room<SuperhotState> {
  name = "SUPERHOT"

  possibleActions = new Set<ActionTemplate>([])
}
