import { State } from "../src/state"
import { DumbEntity } from "./helpers/dumbEntity"

let entity: DumbEntity
let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
  entity = new DumbEntity(state)
})

describe(`constructor`, () => {
  test.todo(`doesn't throw up`)
})

describe(`isInteractive`, () => {})

describe(`updateTransform`, () => {})

describe(`resetWorldTransform`, () => {})
