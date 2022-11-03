import { DumbEntity } from "../../__test__/helpers/dumbEntities.js"
import { Player } from "../../player/player.js"
import { State } from "../state.js"

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
