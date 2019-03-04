import { State } from "../src/state"

let state: State

describe(`Root Entity`, () => {
  beforeEach(() => {
    state = null
  })

  test(`creates proper Root element`, () => {
    state = new State()
    expect(state.entities.id).toBe(State.ROOT_ID)
    expect(state.entities.parent).toBe(null)
    expect(state.entities.owner).toBe(null)
    expect(state.entities.length).toBe(0)
  })
})
