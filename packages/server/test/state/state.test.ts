import { Player } from "../../src"
import { State } from "../../src/state/state"
import { DumbEntity } from "../helpers/dumbEntities"

let state: State

beforeEach(() => {
  state = new State()
})

describe(`State`, () => {
  test.todo(`creates proper Root element`)

  test(`#registerEntity`, () => {
    const ent1 = new DumbEntity(state)
    expect(ent1.id).toBe(0)

    const ent2 = new DumbEntity(state)
    expect(ent2.id).toBe(1)

    expect(() => ((ent1 as any)["id"] = 1000)).toThrow()
  })

  test("#get currentPlayer", () => {
    state.players[0] = new Player({ clientID: "player1" })
    state.currentPlayerIdx = 0

    expect(state.currentPlayer.clientID).toBe("player1")
  })
})
