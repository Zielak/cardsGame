import { ServerPlayerMessage, State } from "@cardsgame/server"
import {
  filterActionsByInteraction,
  runConditionsOnAction,
} from "@cardsgame/server/lib/interaction"
import { MakeEvent, makeEventSetup } from "src/makeEvent"
import { TestEvent, testEvent, testEventSetup } from "src/testEvent"

import { ActionMessage } from "./helpers"

jest.mock("@cardsgame/server/lib/interaction")

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
