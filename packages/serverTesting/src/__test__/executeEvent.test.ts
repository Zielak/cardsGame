import {
  type Room,
  type State,
  type ServerPlayerMessage,
  defineRoom,
} from "@cardsgame/server"

import { executeEvent, executeEventSetup } from "../executeEvent.js"
import { makeInteraction } from "../makeInteraction.js"

const roomConstructor = defineRoom("TestingRoom", {})
let room: Room<State>
let event: ServerPlayerMessage

const roomGetter = () => room

beforeEach(() => {
  room = new roomConstructor()
  room.handleMessage = jest.fn()
  room.onCreate()

  event = makeInteraction(room.state, { type: "state" }, "tap")
})

describe("calls room.handleMessage", () => {
  test("executeEvent", () => {
    executeEvent(room, event)

    expect(room.handleMessage).toHaveBeenCalledWith(event)
  })
  test("executeEventInner", () => {
    const executeEventInner = executeEventSetup(roomGetter)
    executeEventInner(event)

    expect(room.handleMessage).toHaveBeenCalledWith(event)
  })
})
