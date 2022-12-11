import { type ServerPlayerMessage, State } from "@cardsgame/server"
// import { runConditionOnAction } from "@cardsgame/server/internal/interaction/runConditionOnAction"

import { MakeEvent, makeEventSetup } from "../makeEvent.js"
import { TestEvent, testEvent, testEventSetup } from "../testEvent.js"

import { ActionMessage } from "./helpers.js"

// jest.mock("@cardsgame/server/internal/interaction/runConditionOnAction")

let state: State
let testEventInner: TestEvent
let makeEvent: MakeEvent
let event: ServerPlayerMessage

// const mockedRunConditionOnAction = jest.mocked(runConditionOnAction)
// mockedRunConditionOnAction.mockImplementation(() => undefined)

beforeAll(() => {
  jest.resetAllMocks()
  state = new State()
  jest.spyOn(ActionMessage, "checkPrerequisites")
  jest.spyOn(ActionMessage, "checkConditions")
  testEventInner = testEventSetup(() => state, ActionMessage)
  makeEvent = makeEventSetup(() => state)
})

describe("calls filter functions", () => {
  test("testEventInner", () => {
    event = makeEvent("customMessage")
    testEventInner(event)

    // expect(mockedRunConditionOnAction).toHaveBeenCalled()
    expect(ActionMessage.checkPrerequisites).toHaveBeenCalled()
    expect(ActionMessage.checkConditions).toHaveBeenCalled()
  })
  test("testEvent", () => {
    event = makeEvent("customMessage")
    testEvent(state, ActionMessage, event)

    // expect(mockedRunConditionOnAction).toHaveBeenCalled()
    expect(ActionMessage.checkPrerequisites).toHaveBeenCalled()
    expect(ActionMessage.checkConditions).toHaveBeenCalled()
  })
})
