import { DumbParent, DumbEntity } from "../helpers/dumbEntities"
import { SmartParent, SmartEntity } from "../helpers/smartEntities"
import { IdentityTrait, ChildTrait } from "../../src/traits/index"
import { State } from "../../src/state"

let state: State

beforeEach(() => {
  state = new State()
})

describe("ParentConstructor", () => {
  test("sets default properties", () => {
    let parent = new DumbParent(state)

    expect(parent.countChildren()).toBe(0)

    expect(parent.hijacksInteractionTarget).toBeDefined()
    expect(parent.hijacksInteractionTarget).toBe(true)
  })
})

describe("#removeChildAt", () => {
  let parent: DumbParent
  beforeEach(() => {
    parent = new DumbParent(state)
  })
  it("throws on invalid `idx`", () => {
    expect(() => parent.removeChildAt(-2)).toThrow()
    expect(() => parent.removeChildAt(NaN)).toThrow()
    expect(() => parent.removeChildAt(Infinity)).toThrow()
    expect(() => parent.removeChildAt(10)).toThrow()
  })
  it("removes the only child", () => {
    new DumbEntity(state, { parent })

    expect(parent.countChildren()).toBe(1)
    expect(parent.removeChildAt(0)).toBe(true)
    expect(parent.countChildren()).toBe(0)
  })
  it("removes child in the middle", () => {
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    expect(parent.countChildren()).toBe(3)
    expect(parent.removeChildAt(1)).toBe(true)
    expect(parent.countChildren()).toBe(2)
  })
})

describe("#removeChild", () => {
  let parent: DumbParent
  it("calls removeChildAt", () => {
    parent = new DumbParent(state)
    const entity = new DumbEntity(state, { parent })

    expect(parent.countChildren()).toBe(1)
    expect(parent.removeChild(entity)).toBe(true)
    expect(parent.countChildren()).toBe(0)
  })

  it("finds proper child", () => {
    parent = new DumbParent(state)
    new DumbEntity(state, { parent })
    const entity = new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    parent.removeChild(entity)
    expect(
      parent.getChildren().map((e: ChildTrait & IdentityTrait) => e.id)
    ).toMatchSnapshot()
  })
})

describe("#moveChildTo", () => {
  let parent
  const mapChildren = p => p.getChildren().map(e => e.id)
  beforeEach(() => {
    parent = new DumbParent(state)
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
  })
  it("moves item down 1 position", () => {
    parent.moveChildTo(2, 1)
    expect(mapChildren(parent)).toMatchSnapshot()
  })
  it("moves item up 1 position", () => {
    parent.moveChildTo(2, 3)
    expect(mapChildren(parent)).toMatchSnapshot()
  })
  it("moves item to bottom", () => {
    parent.moveChildTo(2, 0)
    expect(mapChildren(parent)).toMatchSnapshot()
  })
  it("moves item to top", () => {
    parent.moveChildTo(2, parent.countChildren() - 1)
    expect(mapChildren(parent)).toMatchSnapshot()
  })
  it("doesn't move anything", () => {
    parent.moveChildTo(2, 2)
    expect(mapChildren(parent)).toMatchSnapshot()
  })

  it("throws on out of range idx", () => {
    expect(() => parent.moveChildTo(2, 10)).toThrow()
    expect(() => parent.moveChildTo(-2, 3)).toThrow()
  })
})

test.todo("#countChildren")
describe("#getChildren", () => {
  let parent: DumbParent
  beforeEach(() => {
    parent = new DumbParent(state)
  })
  test("empty parent", () => {
    expect(parent.getChildren()).toMatchSnapshot()
  })
  test("couple of children", () => {
    const first = new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    const last = new DumbEntity(state, { parent })

    const result = parent.getChildren()
    expect(result).toMatchSnapshot()
    expect(result[0]).toBe(first)
    expect(result[result.length - 1]).toBe(last)
  })
})

describe("#getChild", () => {
  let parent
  let entity
  it("gets child", () => {
    parent = new DumbParent(state)
    new DumbEntity(state, { parent })
    entity = new DumbEntity(state, { parent })

    expect(parent.getChild(1)).toBe(entity)
  })
  it.todo("throws if idx out of range")
})

test("#getTop", () => {
  const parent = new DumbParent(state)
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  const entity = new DumbEntity(state, { parent })

  expect(parent.getTop()).toBe(entity)
})

test("#getBottom", () => {
  const parent = new DumbParent(state)
  const entity = new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })

  expect(parent.getBottom()).toBe(entity)
})

// getDescendants is now only used for debugging?
test.todo("#getDescendants")

describe("queryRunner functions", () => {
  let parentA, parentB, targetA, targetB, parentC, targetC

  beforeEach(() => {
    state = new State()

    parentA = new SmartParent(state, { name: "parentA" })
    parentB = new SmartParent(state, { name: "parentB" })

    // Parent A
    new SmartEntity(state, { type: "foo", parent: parentA })
    new SmartEntity(state, { type: "baz", parent: parentA })
    new SmartEntity(state, { type: "foo", parent: parentA })
    targetA = new SmartEntity(state, {
      type: "bar",
      name: "targetA",
      parent: parentA
    })

    // Parent B
    targetB = new SmartEntity(state, {
      type: "bar",
      name: "targetB",
      parent: parentB
    })
    new SmartEntity(state, { type: "foo", parent: parentB })
    new SmartEntity(state, { name: "bar", parent: parentB })
    parentC = new SmartParent(state, {
      name: "parentC",
      type: "baz",
      parent: parentB
    })
    new SmartEntity(state, { type: "foo", parent: parentB })

    // Parent C
    new SmartEntity(state, { type: "foo", parent: parentC })
    targetC = new SmartEntity(state, {
      type: "bar",
      name: "targetC",
      parent: parentC
    })
    new SmartEntity(state, { type: "foo", parent: parentC })
    new SmartEntity(state, { type: "foo", parent: parentC })
    new SmartEntity(state, { type: "foo", parent: parentC })
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
      expect(parentB.query({ type: "baz" })).toBe(parentC)
      expect(parentB.query({ type: "baz", name: "parentC" })).toBe(parentC)

      expect(parentB.query({ name: "targetB" })).toBe(targetB)
      expect(parentB.query({ type: "bar" })).toBe(targetB)
      expect(parentB.query({ type: "bar", name: "targetB" })).toBe(targetB)
    })
  })
  describe("#query, with parent", () => {
    test("starting from state, finds deeply anywhere", () => {
      expect(state.query({ type: "baz", parent: { name: "parentB" } })).toBe(
        parentC
      )
      expect(state.query({ type: "bar", parent: { type: "baz" } })).toBe(
        targetC
      )
    })
  })

  describe("#queryAll, simple", () => {
    test("starting from state, finds deeply anywhere", () => {
      expect(state.queryAll({ type: "foo" }).length).toBe(8)
      expect(state.queryAll({ type: "bar" }).length).toBe(3)
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
      expect(parentB.queryAll({ type: "foo" }).length).toBe(6)
    })
    test("starting from given parent, target one entity", () => {
      expect(parentB.queryAll({ name: "parentC" })[0]).toBe(parentC)
      expect(parentB.queryAll({ name: "targetB" })[0]).toBe(targetB)
    })
  })
  describe("#queryAll, with parent", () => {
    test("starting from state, finds deeply anywhere", () => {
      expect(
        state.queryAll({ type: "baz", parent: { name: "parentB" } })[0]
      ).toBe(parentC)
      expect(state.queryAll({ type: "bar", parent: { type: "baz" } })[0]).toBe(
        targetC
      )
    })
  })
})
