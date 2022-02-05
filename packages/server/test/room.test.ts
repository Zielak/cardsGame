import { Client, Room as ColyRoom } from "@colyseus/core"
import { Room } from "src/room"

let room: Room<any>

jest.mock("@colyseus/core")

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

describe("broadcast", () => {
  beforeEach(() => {
    ColyRoom.prototype.broadcast
  })

  it("wraps message into data", () => {
    room.broadcast("test", 1)
    expect(ColyRoom.prototype.broadcast).toHaveBeenCalledWith("test", {
      data: 1,
    })
  })

  it("adds undo to wrapped message, but doesn't pass it to coly", () => {
    room.broadcast("test", 1, { undo: true })
    expect(ColyRoom.prototype.broadcast).toHaveBeenCalledWith("test", {
      data: 1,
      undo: true,
    })

    room.broadcast("test", 1, { undo: true, except: {} as Client })
    expect(ColyRoom.prototype.broadcast).toHaveBeenCalledWith(
      "test",
      {
        data: 1,
        undo: true,
      },
      { except: {} }
    )
  })
})
