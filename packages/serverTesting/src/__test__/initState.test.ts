import { State } from "@cardsgame/server"
import type { ClassicCard, Hand } from "@cardsgame/server/entities"

import { initState, InitState, initStateSetup } from "../initState.js"

let state: State
let initStateInner: InitState<State>

beforeAll(() => {
  initStateInner = initStateSetup(State)
})

it("creates new State instance", () => {
  expect(initStateInner({}) instanceof State).toBeTruthy()
  expect(initStateInner() instanceof State).toBeTruthy()
  expect(initState({}) instanceof State).toBeTruthy()
  expect(initState() instanceof State).toBeTruthy()
})

describe("children", () => {
  it("creates cards", () => {
    state = initStateInner({
      children: [{ type: "classicCard", name: "D7" }],
    })

    const firstChild = state.getBottom<ClassicCard>()

    expect(firstChild.type).toBe("classicCard")
  })

  test("type defaults to classicCard", () => {
    state = initStateInner({
      children: [{ name: "D7" }],
    })

    const firstChild = state.getBottom<ClassicCard>()

    expect(firstChild.type).toBe("classicCard")
  })

  it("creates children recursively", () => {
    state = initStateInner({
      children: [
        {
          type: "hand",
          children: [{ name: "D7" }, { name: "C8" }],
        },
      ],
    })

    const hand = state.getChild<Hand>(0)

    expect(hand.type).toBe("hand")
    expect(hand.getBottom<ClassicCard>().type).toBe("classicCard")
    expect(hand.getBottom<ClassicCard>().name).toBe("D7")
    expect(hand.getTop<ClassicCard>().type).toBe("classicCard")
    expect(hand.getTop<ClassicCard>().name).toBe("C8")
  })

  it("prepares selected children", () => {
    state = initStateInner({
      children: [
        {
          type: "hand",
          children: [{ name: "D7" }, { name: "C8" }],
          selected: [1],
        },
      ],
    })

    const hand = state.getChild<Hand>(0)

    expect(hand.isChildSelected(0)).toBe(false)
    expect(hand.isChildSelected(1)).toBe(true)
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
    expect(state.clients[0]).toBe("testClient")
  })

  it("sets players on state", () => {
    state = initStateInner({
      players: [
        { clientID: "namedPlayer", name: "Joe" },
        { clientID: "unnamedPlayer" },
      ],
    })

    // expect(state.players instanceof ArraySchema).toBe(true)
    expect(state.players.length).toBe(2)
    expect(state.players[0].clientID).toBe("namedPlayer")
    expect(state.players[0].name).toBe("Joe")
    expect(state.players[1].clientID).toBe("unnamedPlayer")
    expect(typeof state.players[1].name).toBe("string")
  })
})
