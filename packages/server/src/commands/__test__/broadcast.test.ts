import { TestRoom } from "../../__helpers__/room.js"
import type { Room } from "../../room/base.js"
import { State } from "../../state/state.js"
import { Broadcast } from "../index.js"

jest.mock("../../room.js")

let state: State
let room: Room<State>
const messageType = "testing"
const message = 123

beforeEach(() => {
  state = new State()
  room = new TestRoom()
})

describe("constructor", () => {
  it("remembers message object", () => {
    const cmd = new Broadcast(messageType, message)

    expect(cmd.message).toBe(message)
    expect(cmd.type).toBe(messageType)
  })

  test("message is optional", () => {
    const cmd = new Broadcast(messageType)

    expect(cmd.type).toBe(messageType)
    expect(cmd.message).toBeUndefined()
  })
})

describe("execute", () => {
  it("calls room.broadcast with same message", () => {
    room.broadcast = jest.fn()

    new Broadcast(messageType, message).execute(state, room)

    expect(room.broadcast).toHaveBeenCalledWith(messageType, message)
  })

  it("calls room.broadcast with just messageType", () => {
    room.broadcast = jest.fn()

    new Broadcast(messageType).execute(state, room)

    expect(room.broadcast).toHaveBeenCalledWith(messageType, undefined)
  })
})

describe("undo", () => {
  it("calls room.broadcast with same message + undo mark", () => {
    room.broadcast = jest.fn()

    new Broadcast(messageType, message).undo(state, room)

    expect(room.broadcast).toHaveBeenCalledWith(messageType, message, {
      undo: true,
    })
  })
  it("calls room.broadcast with messageType + only undo mark", () => {
    room.broadcast = jest.fn()

    new Broadcast(messageType).undo(state, room)

    expect(room.broadcast).toHaveBeenCalledWith(messageType, undefined, {
      undo: true,
    })
  })
})
