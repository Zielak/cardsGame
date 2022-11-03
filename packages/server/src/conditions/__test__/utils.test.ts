import { State } from "../../state/state.js"
import { getCustomError } from "../errors.js"
import { getFlag, getRef, setRef } from "../utils.js"

import { ConditionsTest } from "./conditions.js"

let state: State
let con: ConditionsTest<State>

beforeEach(() => {
  state = new State()
  con = new ConditionsTest(state, { example: "foo" })
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
