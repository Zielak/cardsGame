import { NextRound } from "../../src/commands/nextRound"
import { State } from "../../src/state/state"
import { RoomMock } from "../helpers/roomMock"

let state: State
let room

beforeEach(() => {
  state = new State()
  room = new RoomMock()
})

describe("execute", () => {
  it("bumps round number and executed onRoundStart", () => {
    room.onRoundStart = jest.fn()
    room.onRoundEnd = jest.fn()

    new NextRound().execute(state, room)
    expect(state.round).toBe(1)
    expect(room.onRoundStart).toHaveBeenCalledTimes(1)
    expect(room.onRoundEnd).toHaveBeenCalledTimes(1)
  })
})

describe("undo", () => {
  it("calls room.broadcast with same message + undo mark", () => {
    room.onRoundStart = jest.fn()
    room.onRoundEnd = jest.fn()

    state.round = 10

    new NextRound().undo(state, room)

    expect(state.round).toBe(9)
    expect(room.onRoundStart).toHaveBeenCalledTimes(1)
    expect(room.onRoundEnd).toHaveBeenCalledTimes(1)
  })
})
