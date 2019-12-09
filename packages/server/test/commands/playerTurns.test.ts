import { NextPlayer, PreviousPlayer } from "../../src/commands/playerTurns"
import { State } from "../../src/state"
import { Player } from "../../src/player"
import { RoomMock } from "../helpers/roomMock"

let state: State
let room

beforeEach(() => {
  state = new State()
  state.players[0] = new Player({ clientID: "a" })
  state.players[1] = new Player({ clientID: "b" })
  state.players[2] = new Player({ clientID: "c" })
  state.players[3] = new Player({ clientID: "d" })

  room = new RoomMock()
})

describe("NextPlayer", () => {
  test("execute", () => {
    expect(state.currentPlayerIdx).toBe(0)
    new NextPlayer().execute(state, room)
    expect(state.currentPlayerIdx).toBe(1)
  })
})

describe("PreviousPlayer", () => {
  test("execute", () => {
    expect(state.currentPlayerIdx).toBe(0)
    new PreviousPlayer().execute(state, room)
    expect(state.currentPlayerIdx).toBe(3)
  })
})
