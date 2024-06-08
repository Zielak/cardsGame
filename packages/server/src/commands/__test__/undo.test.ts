import type { Room } from "@/room/base.js"
import { State } from "@/state/state.js"

import { TestRoom } from "../../__helpers__/room.js"
import { Undo } from "../undo.js"

let state: State
let room: Room<State>

beforeEach(() => {
  state = new State()
  room = new TestRoom()
})

describe("execute", () => {
  it("calls room.commandsManager.undoLastCommand", () => {
    new Undo().execute(state, room)

    expect(room.commandsManager.undoLastCommand).toHaveBeenCalledWith(state)
  })
})

describe("undo", () => {
  it("throws an error", async () => {
    const command = new Undo()
    await expect(command.undo()).rejects.toThrow("not implemented")
  })
})
