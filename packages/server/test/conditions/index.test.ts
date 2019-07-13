import { OR, AND, NOT } from "../../src/conditions"
import { State } from "../../src/state"

const TRUE = () => true
const FALSE = () => false

const state = new State({
  minClients: 1,
  maxClients: 4,
  hostID: "asd"
})

const run = cond => cond(state, {})

test("OR", () => {
  expect(run(OR(FALSE))).toBe(false)
  expect(run(OR(TRUE))).toBe(true)

  expect(run(OR(FALSE, FALSE))).toBe(false)
  expect(run(OR(TRUE, FALSE))).toBe(true)
  expect(run(OR(FALSE, TRUE))).toBe(true)

  expect(run(OR(FALSE, TRUE, FALSE))).toBe(true)
  expect(run(OR(FALSE, FALSE, FALSE))).toBe(false)
})

test("AND", () => {
  expect(run(AND(TRUE))).toBe(true)
  expect(run(AND(FALSE))).toBe(false)

  expect(run(AND(FALSE, FALSE))).toBe(false)
  expect(run(AND(TRUE, FALSE))).toBe(false)
  expect(run(AND(TRUE, TRUE))).toBe(true)

  expect(run(AND(FALSE, TRUE, FALSE))).toBe(false)
  expect(run(AND(TRUE, TRUE, TRUE))).toBe(true)
})

test("NOT", () => {
  expect(run(NOT(TRUE))).toBe(false)
  expect(run(NOT(FALSE))).toBe(true)

  expect(run(NOT(FALSE, FALSE))).toBe(true)
  expect(run(NOT(TRUE, FALSE))).toBe(true)
  expect(run(NOT(TRUE, TRUE))).toBe(false)

  expect(run(NOT(FALSE, TRUE, FALSE))).toBe(true)
  expect(run(NOT(TRUE, TRUE, TRUE))).toBe(false)
})
