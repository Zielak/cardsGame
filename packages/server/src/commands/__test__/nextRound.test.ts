import type { Room } from "@/room/base.js"
import { State } from "@/state/state.js"

import { TestRoom } from "../../__helpers__/room.js"
import { NextRound } from "../nextRound.js"
import { Noop } from "../noop.js"

let state: State
let room: Room<State>

beforeEach(() => {
  state = new State()
  room = new TestRoom()
})

describe("execute", () => {
  it("bumps round number and executed onRoundStart", () => {
    room.onRoundStart = jest.fn()
    room.onRoundEnd = jest.fn()

    expect(state.round).toBe(0)
    new NextRound().execute(state, room)
    expect(state.round).toBe(1)

    expect(room.onRoundStart).toHaveBeenCalledTimes(1)
    expect(room.onRoundEnd).toHaveBeenCalledTimes(1)
  })

  it("executes commands out of callback", () => {
    const noopPre = new Noop()
    const noopPost = new Noop()
    noopPre.execute = jest.fn()
    noopPost.execute = jest.fn()

    room.onRoundStart = jest.fn(() => [noopPre])
    room.onRoundEnd = jest.fn(() => [noopPost])

    const nextRound = new NextRound()

    nextRound.execute(state, room)

    expect(noopPre.execute).toHaveBeenCalled()
    expect(noopPost.execute).toHaveBeenCalled()
  })
})

describe.skip("undo", () => {
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
