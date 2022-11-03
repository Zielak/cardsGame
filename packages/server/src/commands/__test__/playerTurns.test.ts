import { Player } from "../../player/player.js"
import { Room } from "../../room.js"
import { State } from "../../state/state.js"
import { NextPlayer, PreviousPlayer } from "../playerTurns.js"

jest.mock("../../room.js")

let state: State
let room: Room<State>

beforeEach(() => {
  state = new State()
  state.players.push(
    new Player({ clientID: "a" }),
    new Player({ clientID: "b" }),
    new Player({ clientID: "c" }),
    new Player({ clientID: "d" })
  )

  room = new Room()
})

describe("NextPlayer", () => {
  test("execute", () => {
    expect(state.currentPlayerIdx).toBe(0)
    new NextPlayer().execute(state, room)
    expect(state.currentPlayerIdx).toBe(1)
  })

  it("throws on non-turn based games", async () => {
    state.turnBased = false
    await expect(new NextPlayer().execute(state, room)).rejects.toThrow()
  })
})

describe("PreviousPlayer", () => {
  test("execute", () => {
    expect(state.currentPlayerIdx).toBe(0)
    new PreviousPlayer().execute(state, room)
    expect(state.currentPlayerIdx).toBe(3)
  })
  it("throws on non-turn based games", async () => {
    state.turnBased = false
    await expect(new PreviousPlayer().execute(state, room)).rejects.toThrow()
  })
})
