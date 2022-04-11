import { Client, Room as ColyRoom } from "@colyseus/core"
import { start } from "src/messages/start"
import { Room } from "src/room"

let room: Room<any>

jest.mock("@colyseus/core")

beforeEach(() => {
  room = new Room()
  room.setPatchRate(0)
  room.clients = []
  room.state = {
    isGameOver: false,
  }
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

describe("integration tests", () => {
  beforeEach(() => {
    room.integrationHooks = {
      test1: {
        init: jest.fn(),
        startPre: jest.fn(),
        startPost: jest.fn(),
      },
      test2: {
        init: jest.fn(),
        startPre: jest.fn(),
        startPost: jest.fn(),
      },
    }
  })

  it("calls hooks of one test", () => {
    room.onCreate({ test: "test1" })

    expect(room.integrationHooks.test1.init).toHaveBeenCalledWith(room.state)
    expect(room.integrationHooks.test1.startPre).not.toHaveBeenCalled()
    expect(room.integrationHooks.test1.startPost).not.toHaveBeenCalled()

    expect(room.integrationHooks.test2.init).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPre).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPost).not.toHaveBeenCalled()

    start.call(room)

    expect(room.integrationHooks.test1.init).toHaveBeenCalledWith(room.state)
    expect(room.integrationHooks.test1.startPre).toHaveBeenCalledWith(
      room.state
    )
    expect(room.integrationHooks.test1.startPost).toHaveBeenCalledWith(
      room.state
    )

    expect(room.integrationHooks.test2.init).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPre).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPost).not.toHaveBeenCalled()
  })

  it("doesn't call any hook", () => {
    room.onCreate()

    expect(room.integrationHooks.test1.init).not.toHaveBeenCalled()
    expect(room.integrationHooks.test1.startPre).not.toHaveBeenCalled()
    expect(room.integrationHooks.test1.startPost).not.toHaveBeenCalled()

    expect(room.integrationHooks.test2.init).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPre).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPost).not.toHaveBeenCalled()

    start.call(room)

    expect(room.integrationHooks.test1.init).not.toHaveBeenCalled()
    expect(room.integrationHooks.test1.startPre).not.toHaveBeenCalled()
    expect(room.integrationHooks.test1.startPost).not.toHaveBeenCalled()

    expect(room.integrationHooks.test2.init).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPre).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPost).not.toHaveBeenCalled()
  })
})
