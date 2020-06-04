import { State } from "../src/state/state"
import { DumbEntity } from "./helpers/dumbEntities"

let state: State

describe(`State`, () => {
  test.todo(`creates proper Root element`)

  test(`#registerEntity`, () => {
    state = new State()

    const ent1 = new DumbEntity(state)
    expect(ent1.id).toBe(0)

    const ent2 = new DumbEntity(state)
    expect(ent2.id).toBe(1)

    expect(() => ((ent1 as any)["id"] = 1000)).toThrow()
  })

  test.todo("#get currentPlayer")
  test.todo("#get playersCount")
})

test.todo("#getEntitiesAlongPath")
