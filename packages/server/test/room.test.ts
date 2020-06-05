import { Schema } from "@colyseus/schema"

import { Room } from "../src/room"
import { State } from "../src/state/state"

let room: Room<any>

beforeEach(() => {
  room = new Room()
})

test("constructor", () => {
  expect(() => new Room()).not.toThrow()
})

describe("onCreate", () => {
  it("calls onInitGame", () => {
    room.onInitGame = jest.fn()

    room.onCreate()
    expect(room.onInitGame).toHaveBeenCalled()

    const options = { test: "asd" }
    room.onCreate(options)
    expect(room.onInitGame).toHaveBeenLastCalledWith(options)
  })

  it("creates an empty set for non-existing possibleActions", () => {
    expect(room.possibleActions instanceof Set).toBe(false)

    room.onCreate()
    expect(room.possibleActions instanceof Set).toBe(true)
  })
})
