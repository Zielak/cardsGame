import { Broadcast } from "../../src/commands"
import { State } from "../../src/state"
import { RoomMock } from "../helpers/roomMock"

let state: State
let room
const message: ServerMessage = {
  type: "testing",
  data: 123
}

beforeEach(() => {
  state = new State()
  room = new RoomMock()
})

describe("constructor", () => {
  it("remembers message object", () => {
    const cmd = new Broadcast(message)

    expect(cmd.message).toBe(message)
  })
})

describe("execute", () => {
  it("calls room.broadcast with same message", () => {
    room.broadcast = jest.fn()

    new Broadcast(message).execute(state, room)

    expect(room.broadcast).toHaveBeenCalledWith(message)
  })
})

describe("undo", () => {
  it("calls room.broadcast with same message + undo mark", () => {
    room.broadcast = jest.fn()

    new Broadcast(message).undo(state, room)

    expect(room.broadcast).toHaveBeenCalled()
    expect(room.broadcast.mock.calls[0][0]).toMatchObject({
      ...message,
      undo: true
    })
  })
})
