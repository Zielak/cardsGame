import { State } from "../../state/state.js"
import { Conditions } from "../conditions.js"
import { prepareConditionsContext } from "../context/utils.js"
import { getCustomError } from "../errors.js"
import { getFlag, getRef, setRef } from "../utils.js"

import { ConditionsTest } from "./conditions.js"

let state: State
let con: ConditionsTest

beforeEach(() => {
  state = new State()
  con = new Conditions(prepareConditionsContext(state, { example: "foo" }))
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
