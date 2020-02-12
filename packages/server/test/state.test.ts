import { State } from "../src/state"

let state: State

describe(`State`, () => {
  test.todo(`creates proper Root element`)

  test(`#registerEntity`, () => {
    state = new State()

    let newID = state.registerEntity({})
    expect(newID).toBe(0)

    newID = state.registerEntity({})
    expect(newID).toBe(1)
  })

  test("#clientsCount", () => {
    state = new State()

    expect(state.clientsCount).toBe(0)

    state.clients[0] = "1234"
    state.clients[1] = "qwer"

    expect(state.clientsCount).toBe(2)
  })

  test.todo("#get currentPlayer")
  test.todo("#get playersCount")

  test.todo("#getEntitiesAlongPath")
})
