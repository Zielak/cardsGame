import { Room } from "../src/room"

let room: Room<any>

beforeEach(() => {
  room = new Room()
  room.setPatchRate(0)
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
