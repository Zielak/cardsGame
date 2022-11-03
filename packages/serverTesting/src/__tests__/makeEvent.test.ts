import { type ServerPlayerMessage, State } from "@cardsgame/server"

import { makeEvent, MakeEvent, makeEventSetup } from "../makeEvent.js"

let state: State
let makeEventInner: MakeEvent
let events: ServerPlayerMessage[]

beforeAll(() => {
  state = new State()
  makeEventInner = makeEventSetup(() => state)
})

it("makes valid event for string interaction", () => {
  const message = { data: "nothing" }
  events = [
    makeEventInner(message, "customMessage"),
    makeEvent(state, message, "customMessage"),
  ]

  events.forEach((event) => {
    expect(event).toBeDefined()
    expect(event.messageType).toBe("customMessage")
    expect(event.timestamp).toBeDefined()
    expect(event.data).toStrictEqual(message.data)
  })
})
