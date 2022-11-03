import { type ServerPlayerMessage, State } from "@cardsgame/server"
import { filterActionsByInteraction } from "@cardsgame/server/internal/interaction/filterActionsByInteraction"
import { runConditionsOnAction } from "@cardsgame/server/internal/interaction/runConditionsOnAction"

import { MakeEvent, makeEventSetup } from "../makeEvent.js"
import { TestEvent, testEvent, testEventSetup } from "../testEvent.js"

import { ActionMessage } from "./helpers.js"

jest.mock("@cardsgame/server/internal/interaction/filterActionsByInteraction")
jest.mock("@cardsgame/server/internal/interaction/runConditionsOnAction")

let state: State
let testEventInner: TestEvent
let makeEvent: MakeEvent
let event: ServerPlayerMessage

const mockedFilterActionsByInteraction = jest.mocked(filterActionsByInteraction)
const mockedRunConditionsOnAction = jest.mocked(runConditionsOnAction)

const innerInteraction = jest.fn((action): boolean => true)

mockedFilterActionsByInteraction.mockImplementation(() => innerInteraction)
mockedRunConditionsOnAction.mockImplementation(() => undefined)

beforeAll(() => {
  state = new State()
  testEventInner = testEventSetup(() => state, ActionMessage)
  makeEvent = makeEventSetup(() => state)
})

describe("calls filter functions", () => {
  test("testEventInner", () => {
    event = makeEvent({ data: "customMessage" })
    testEventInner(event)

    expect(mockedFilterActionsByInteraction).toHaveBeenCalledWith(event)
    expect(mockedRunConditionsOnAction).toHaveBeenCalledWith(
      state,
      event,
      ActionMessage
    )

    expect(innerInteraction).toHaveBeenCalledWith(ActionMessage)
  })
  test("testEvent", () => {
    event = makeEvent({ data: "customMessage" })
    testEvent(state, ActionMessage, event)

    expect(mockedFilterActionsByInteraction).toHaveBeenCalledWith(event)
    expect(mockedRunConditionsOnAction).toHaveBeenCalledWith(
      state,
      event,
      ActionMessage
    )

    expect(innerInteraction).toHaveBeenCalledWith(ActionMessage)
  })
})
