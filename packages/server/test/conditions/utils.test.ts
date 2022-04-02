import { getCustomError } from "src/conditions/errors"
import { getFlag, getRef, setRef } from "src/conditions/utils"
import { State } from "src/state"

import { ConditionsMock } from "../helpers/conditionsMock"

let state: State
let con: ConditionsMock<State>

beforeEach(() => {
  state = new State()
  con = new ConditionsMock(state, { example: "foo" })
})

test("getFlag", () => {
  expect(() => getFlag({}, "subject")).toThrow()
})

test("getRef", () => {
  expect(() => getRef({}, "subject")).toThrow()
})

test("setRef", () => {
  expect(() => setRef({}, "subject", "value")).toThrow()
})

test("getCustomError", () => {
  const error = "Hello"
  const coreRef = con(error)

  expect(getCustomError(coreRef)).toBe(error)
})
