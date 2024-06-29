import { Client, Room as ColyRoom } from "@colyseus/core"

import { ENTITY_INTERACTION } from "@/interaction/constants.js"
import { start } from "@/messages/start.js"
import { Bot } from "@/player/bot.js"
import { Player } from "@/player/player.js"
import { GameClient } from "@/state/client.js"
import { State } from "@/state/state.js"

import { Room } from "../base.js"

jest.mock("@/state/state.js")
jest.mock("@/player/player.js")
jest.mock("@colyseus/core")

let room: Room<State>

class TestRoom extends Room<State> {}

beforeEach(() => {
  room = new TestRoom()
  room.setPatchRate(0)
  room.clients = []
  room.state = new State()
  room.stateConstructor = State
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
    expect(Array.isArray(room.possibleActions)).toBe(false)

    room.onCreate()
    expect(Array.isArray(room.possibleActions)).toBe(true)
  })
})

describe("handleMessage", () => {
  describe("throws error", () => {
    test("if message did't include player", async () => {
      await expect(
        room.handleMessage({
          messageType: ENTITY_INTERACTION,
          timestamp: 123456,
        }),
      ).rejects.toThrow("client is not a player")
    })

    test("if game is already over", async () => {
      room.state.isGameOver = true
      await expect(
        room.handleMessage({
          messageType: ENTITY_INTERACTION,
          timestamp: 123456,
          player: new Player({ clientID: "qwf" }),
        }),
      ).rejects.toThrow("game's already over")
    })
  })
})

describe("broadcast", () => {
  beforeEach(() => {
    // the fuk?
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
      { except: {} },
    )
  })
})

describe("integration tests", () => {
  beforeEach(() => {
    room.integrationHooks = {
      test1: {
        data: { foo: "bar" },
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

    expect(room.integrationHooks.test1.init).toHaveBeenCalledWith(
      room.state,
      room.integrationContext,
    )
    expect(room.integrationHooks.test1.startPre).not.toHaveBeenCalled()
    expect(room.integrationHooks.test1.startPost).not.toHaveBeenCalled()

    expect(room.integrationHooks.test2.init).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPre).not.toHaveBeenCalled()
    expect(room.integrationHooks.test2.startPost).not.toHaveBeenCalled()

    start.call(room)

    expect(room.integrationHooks.test1.init).toHaveBeenCalledWith(
      room.state,
      room.integrationContext,
    )
    expect(room.integrationHooks.test1.startPre).toHaveBeenCalledWith(
      room.state,
      room.integrationContext,
    )
    expect(room.integrationHooks.test1.startPost).toHaveBeenCalledWith(
      room.state,
      room.integrationContext,
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

  it("updates currentIntegration", () => {
    expect(room.currentIntegration).toBeUndefined()

    room.onCreate({ test: "test1" })

    expect(room.currentIntegration.name).toBe("test1")
    expect(room.currentIntegration.data).toBe(room.integrationHooks.test1.data)
  })

  describe("context", () => {
    it("is available with integration", () => {
      room.onCreate({ test: "test1" })
      expect(() => room.integrationContext.addClient("FOO")).not.toThrow()
      expect(room.integrationContext.data).toBe(
        room.integrationHooks.test1.data,
      )
    })
    it("is unavailable without integration", () => {
      room.onCreate()
      expect(room.integrationContext).toBeUndefined()
    })
  })
})

describe("addClient", () => {
  it("first client is ready by default", () => {
    room.playersCount = undefined
    expect(room.addClient("foo")).toBe(true)
    expect(room.state.clients[0].ready).toBeTruthy()
    expect(room.addClient("bar")).toBe(true)
    expect(room.state.clients[1].ready).toBeFalsy()
  })
  it("allows new human client", () => {
    room.playersCount = undefined
    expect(room.addClient("foo")).toBe(true)
  })
  it("allows new human client within limit", () => {
    room.playersCount = {
      min: 0,
      max: 4,
    }
    expect(room.addClient("foo")).toBe(true)
  })
  it("rejects human client with already recorded ID", () => {
    // @ts-expect-error this just tests
    room.state.clients = [new GameClient("foo")]
    expect(room.addClient("foo")).toBe(false)
  })
  it("allows human client over the playersCount limit", () => {
    // @ts-expect-error this just tests
    room.clients = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }]
    room.playersCount = {
      min: 0,
      max: 4,
    }
    expect(room.addClient("foo")).toBe(true)
  })

  it("allows bot client", () => {
    room.playersCount = undefined
    expect(room.addBot({ clientID: "foo" })).toBe(true)
  })
  it("allows bot client within limit", () => {
    room.playersCount = {
      min: 0,
      max: 4,
      bots: {
        min: 0,
        max: 1,
      },
    }
    expect(room.addBot({ clientID: "foo" })).toBe(true)
  })
  it("rejects bot client", () => {
    room.botClients = [new Bot({ clientID: "foo" })]
    room.playersCount = {
      min: 0,
      max: 4,
      bots: {
        min: 0,
        max: 1,
      },
    }
    expect(room.addBot({ clientID: "foo" })).toBe(false)
  })
})
