import { Broadcast } from "../../src/commands/broadcast"
import { State } from "../../src/state/state"
import { RoomMock } from "../helpers/roomMock"

let state: State
let room
const messageType = "testing"
const message = 123

beforeEach(() => {
  state = new State()
  room = new RoomMock()
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

    expect(room.broadcast.mock.calls[0][0]).toBe(messageType)
    expect(room.broadcast.mock.calls[0][1]).toMatchObject({ data: message })
  })

  it("calls room.broadcast with just messageType", () => {
    room.broadcast = jest.fn()

    new Broadcast(messageType).execute(state, room)

    expect(room.broadcast.mock.calls[0][0]).toBe(messageType)
    expect(room.broadcast.mock.calls[0][1]).toBeUndefined()
  })
})

describe("undo", () => {
  it("calls room.broadcast with same message + undo mark", () => {
    room.broadcast = jest.fn()

    new Broadcast(messageType, message).undo(state, room)

    expect(room.broadcast).toHaveBeenCalled()
    expect(room.broadcast.mock.calls[0][0]).toBe(messageType)
    expect(room.broadcast.mock.calls[0][1]).toMatchObject({
      data: message,
      undo: true,
    })
  })
  it("calls room.broadcast with messageType + only undo mark", () => {
    room.broadcast = jest.fn()

    new Broadcast(messageType).undo(state, room)

    expect(room.broadcast).toHaveBeenCalled()
    expect(room.broadcast.mock.calls[0][0]).toBe(messageType)
    expect(room.broadcast.mock.calls[0][1]).toMatchObject({
      undo: true,
    })
  })
})
