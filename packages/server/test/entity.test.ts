import { State } from "../src/state"
import { DumbEntity } from "./helpers/dumbEntities"

let entity: DumbEntity
let state: State

beforeEach(() => {
  state = new State()
  entity = new DumbEntity(state)
})

describe(`constructor`, () => {
  test.todo(`doesn't throw up`)
})

describe(`isInteractive`, () => {})
