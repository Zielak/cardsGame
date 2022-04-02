import { Conditions } from "src/conditions"
import type { Player } from "src/player"
import type { State } from "src/state"

type InitialSubjectsMock = { example: "foo"; player?: Player }

export class ConditionsMock<S extends State> extends Conditions<
  S,
  InitialSubjectsMock
> {}
