import { State } from "../../src/state/state"
import { SmartEntity, SmartParent } from "../helpers/smartEntities"

let state, parentA, parentB, targetA, targetB, parentC, targetC

beforeEach(() => {
  state = new State()

  parentA = new SmartParent(state, { name: "parentA" })
  parentB = new SmartParent(state, { name: "parentB" })

  // Parent A
  new SmartEntity(state, { customProp: "foo", parent: parentA })
  new SmartEntity(state, { customProp: "baz", parent: parentA })
  new SmartEntity(state, { customProp: "foo", parent: parentA })
  targetA = new SmartEntity(state, {
    customProp: "bar",
    name: "targetA",
    parent: parentA,
  })

  // Parent B
  targetB = new SmartEntity(state, {
    customProp: "bar",
    name: "targetB",
    parent: parentB,
  })
  new SmartEntity(state, { customProp: "foo", parent: parentB })
  new SmartEntity(state, { name: "bar", parent: parentB })
  parentC = new SmartParent(state, {
    name: "parentC",
    customProp: "baz",
    parent: parentB,
  })
  new SmartEntity(state, { customProp: "foo", parent: parentB })

  // Parent C
  new SmartEntity(state, { customProp: "foo", parent: parentC })
  targetC = new SmartEntity(state, {
    customProp: "bar",
    name: "targetC",
    parent: parentC,
  })
  new SmartEntity(state, { customProp: "foo", parent: parentC })
  new SmartEntity(state, { customProp: "foo", parent: parentC })
  new SmartEntity(state, { customProp: "foo", parent: parentC })
})

describe("#query, simple", () => {
  test("starting from state, finds deeply anywhere", () => {
    expect(state.query({ name: "parentA" })).toBe(parentA)
    expect(state.query({ name: "parentB" })).toBe(parentB)
    expect(state.query({ name: "parentC" })).toBe(parentC)

    expect(state.query({ name: "targetA" })).toBe(targetA)
    expect(state.query({ name: "targetB" })).toBe(targetB)
    expect(state.query({ name: "targetC" })).toBe(targetC)
  })

  test("starting from given parent, finds in it and deeply", () => {
    expect(parentB.query({ name: "parentC" })).toBe(parentC)
    expect(parentB.query({ customProp: "baz" })).toBe(parentC)
    expect(parentB.query({ customProp: "baz", name: "parentC" })).toBe(parentC)

    expect(parentB.query({ name: "targetB" })).toBe(targetB)
    expect(parentB.query({ customProp: "bar" })).toBe(targetB)
    expect(parentB.query({ customProp: "bar", name: "targetB" })).toBe(targetB)
  })
})

describe("#query, with parent", () => {
  test("starting from state, finds deeply anywhere", () => {
    expect(
      state.query({ customProp: "baz", parent: { name: "parentB" } })
    ).toBe(parentC)
    expect(
      state.query({ customProp: "bar", parent: { customProp: "baz" } })
    ).toBe(targetC)
  })
})

describe("#queryAll, simple", () => {
  test("starting from state, finds deeply anywhere", () => {
    expect(state.queryAll({ customProp: "foo" }).length).toBe(8)
    expect(state.queryAll({ customProp: "bar" }).length).toBe(3)
  })
  test("starting from state, target one entity", () => {
    expect(state.queryAll({ name: "targetA" }).length).toBe(1)
    expect(state.queryAll({ name: "targetB" }).length).toBe(1)
    expect(state.queryAll({ name: "targetC" }).length).toBe(1)

    expect(state.queryAll({ name: "targetA" })[0]).toBe(targetA)
    expect(state.queryAll({ name: "targetB" })[0]).toBe(targetB)
    expect(state.queryAll({ name: "targetC" })[0]).toBe(targetC)
  })
  test("starting from given parent, finds in it and deeply", () => {
    expect(parentB.queryAll({ customProp: "foo" }).length).toBe(6)
  })
  test("starting from given parent, target one entity", () => {
    expect(parentB.queryAll({ name: "parentC" })[0]).toBe(parentC)
    expect(parentB.queryAll({ name: "targetB" })[0]).toBe(targetB)
  })
})

describe("#queryAll, with parent", () => {
  test("starting from state, finds deeply anywhere", () => {
    expect(
      state.queryAll({
        customProp: "baz",
        parent: { name: "parentB" },
      })[0]
    ).toBe(parentC)
    expect(
      state.queryAll({
        customProp: "bar",
        parent: { customProp: "baz" },
      })[0]
    ).toBe(targetC)
  })
})
