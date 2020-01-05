import { Room } from "../src/room"
import { State } from "../src/state"
import { Schema } from "@colyseus/schema"

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

test("setState", () => {
  expect(room["setState"]).toBeDefined()

  const newState = new State()

  expect(newState instanceof Schema).toBeTruthy()

  expect(() => {
    room["setState"](newState)
  }).not.toThrow()
})