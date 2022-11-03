import type { Player } from "../../player/player.js"
import type { State } from "../../state/state.js"
import { Conditions } from "../conditions.js"

type InitialSubjects = { example: "foo"; player?: Player }

export class ConditionsTest<S extends State> extends Conditions<
  S,
  InitialSubjects
> {}
