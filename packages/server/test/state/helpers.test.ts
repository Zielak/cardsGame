import {
  Bot,
  getAllBots,
  getNextPlayerIdx,
  getPlayerByName,
  getPlayersIndex,
  getPreviousPlayerIdx,
  Player,
  State,
} from "../../src"

let state: State

beforeEach(() => {
  state = new State()
})

test.todo("#getEntitiesAlongPath")

test("#getAllBots", () => {
  state.players[0] = new Player({ clientID: "player1" })
  expect(getAllBots(state).length).toBe(0)

  state.players[1] = new Bot({ clientID: "bot1" })
  expect(getAllBots(state).length).toBe(1)
})

test("#getPlayerByName", () => {
  state.players[0] = new Player({ name: "Bob", clientID: "player1" })
  state.players[1] = new Bot({ name: "Robot", clientID: "bot1" })

  expect(getPlayerByName(state, "Bob")).toBe(state.players[0])
  expect(getPlayerByName(state, "Robot")).toBe(state.players[1])
  expect(getPlayerByName(state, "Alice")).toBeUndefined()
})

test("#getPlayersIndex", () => {
  state.players[0] = new Player({ clientID: "player1" })
  state.players[1] = new Player({ clientID: "player2" })

  expect(getPlayersIndex(state, state.players[0])).toBe(0)
  expect(getPlayersIndex(state, state.players[1])).toBe(1)
})

describe("#getNext/PreviousPlayerIdx", () => {
  test("1 player", () => {
    state.players[0] = new Player({ clientID: "player1" })

    state.currentPlayerIdx = 0
    expect(getNextPlayerIdx(state)).toBe(0)
    expect(getPreviousPlayerIdx(state)).toBe(0)

    state.currentPlayerIdx = -2
    expect(getNextPlayerIdx(state)).toBe(0)
    expect(getPreviousPlayerIdx(state)).toBe(0)

    state.currentPlayerIdx = 10
    expect(getNextPlayerIdx(state)).toBe(0)
    expect(getPreviousPlayerIdx(state)).toBe(0)
  })

  test("2 players", () => {
    state.players[0] = new Player({ clientID: "player1" })
    state.players[1] = new Player({ clientID: "player2" })

    state.currentPlayerIdx = 0
    expect(getNextPlayerIdx(state)).toBe(1)
    expect(getPreviousPlayerIdx(state)).toBe(1)

    state.currentPlayerIdx = 1
    expect(getNextPlayerIdx(state)).toBe(0)
    expect(getPreviousPlayerIdx(state)).toBe(0)

    state.currentPlayerIdx = -2
    expect(getNextPlayerIdx(state)).toBe(1)
    expect(getPreviousPlayerIdx(state)).toBe(1)

    state.currentPlayerIdx = 10
    expect(getNextPlayerIdx(state)).toBe(0)
    expect(getPreviousPlayerIdx(state)).toBe(0)
  })

  test("3 players", () => {
    state.players[0] = new Player({ clientID: "player1" })
    state.players[1] = new Player({ clientID: "player2" })
    state.players[2] = new Player({ clientID: "player2" })

    state.currentPlayerIdx = 0
    expect(getNextPlayerIdx(state)).toBe(1)
    expect(getPreviousPlayerIdx(state)).toBe(2)

    state.currentPlayerIdx = 1
    expect(getNextPlayerIdx(state)).toBe(2)
    expect(getPreviousPlayerIdx(state)).toBe(0)

    state.currentPlayerIdx = -2
    expect(getNextPlayerIdx(state)).toBe(1)
    expect(getPreviousPlayerIdx(state)).toBe(2)

    state.currentPlayerIdx = 10
    expect(getNextPlayerIdx(state)).toBe(0)
    expect(getPreviousPlayerIdx(state)).toBe(1)
  })
})
