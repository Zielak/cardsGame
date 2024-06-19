import { State } from "@cardsgame/server"
import type { ClassicCard, Hand } from "@cardsgame/server/entities"

import { initState, InitState, initStateSetup } from "../initState.js"

let state: State
const getState = () => state
let initStateInner: InitState<State>

beforeAll(() => {
  initStateInner = initStateSetup(getState)
})

beforeEach(() => {
  state = new State()
})

describe("basics", () => {
  it("returns the same state as provided", () => {
    expect(initStateInner({})).toBe(state)
    expect(initState(getState(), {})).toBe(state)
  })

  it("requires state preparation object", () => {
    // @ts-expect-error test
    expect(() => initStateInner()).toThrow()
    // @ts-expect-error test
    expect(() => initState()).toThrow()
  })
})

describe("State", () => {
  it("sets primitive properties on state", () => {
    state = initStateInner({
      currentPlayerIdx: 2,
      round: 10,
      turnBased: false,
      isGameStarted: true,
    })

    expect(state.currentPlayerIdx).toBe(2)
    expect(state.round).toBe(10)
    expect(state.turnBased).toBe(false)
    expect(state.isGameStarted).toBe(true)
  })

  it("sets clients on state", () => {
    state = initStateInner({
      clients: ["testClient"],
    })

    // expect(state.clients instanceof ArraySchema).toBe(true)
    expect(state.clients.length).toBe(1)
    expect(state.clients[0].id).toBe("testClient")
  })

  it("sets players on state", () => {
    state = initStateInner({
      players: [
        { clientID: "namedPlayer", name: "Joe" },
        { clientID: "unnamedPlayer" },
        { name: "Nat" },
        {},
      ],
    })

    // expect(state.players instanceof ArraySchema).toBe(true)
    expect(state.players.length).toBe(4)
    expect(state.players[0].clientID).toBe("namedPlayer")
    expect(state.players[0].name).toBe("Joe")

    expect(state.players[1].clientID).toBe("unnamedPlayer")
    expect(typeof state.players[1].name).toBe("string")

    expect(typeof state.players[2].clientID).toBe("string")
    expect(state.players[2].name).toBe("Nat")

    expect(typeof state.players[3].clientID).toBe("string")
    expect(typeof state.players[3].name).toBe("string")
  })
})
