import {
  getChild,
  getChildren,
  removeChildAt,
  countChildren,
  removeChild,
  getTop,
  getBottom,
  moveChildTo
} from "../src/traits/parent"
import { DumbEntity } from "./helpers/dumbEntity"
import { DumbParent } from "./helpers/dumbParent"
import { State } from "../src/state"

let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
})

describe("ParentConstructor", () => {
  test("sets default properties", () => {
    let parent = new DumbParent(state)

    expect(parent.childrenPointers).toBeDefined()
    expect(parent.childrenPointers.length).toBe(0)

    expect(parent.hijacksInteractionTarget).toBeDefined()
    expect(parent.hijacksInteractionTarget).toBe(true)
  })
})

describe("#removeChildAt", () => {
  let parent
  beforeEach(() => {
    parent = new DumbParent(state)
  })
  it("throws on invalid `idx`", () => {
    expect(() => removeChildAt(parent, -2)).toThrow()
    expect(() => removeChildAt(parent, NaN)).toThrow()
    expect(() => removeChildAt(parent, Infinity)).toThrow()
    expect(() => removeChildAt(parent, 10)).toThrow()
  })
  it("removes the only child", () => {
    new DumbEntity(state, { parent })

    expect(countChildren(parent)).toBe(1)
    expect(removeChildAt(parent, 0)).toBe(true)
    expect(countChildren(parent)).toBe(0)
  })
  it("removes child in the middle", () => {
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    expect(countChildren(parent)).toBe(3)
    expect(removeChildAt(parent, 1)).toBe(true)
    expect(parent._childrenPointers.length).toBe(2)
    expect(countChildren(parent)).toBe(2)
  })
})

describe("#removeChild", () => {
  let parent
  it("calls removeChildAt", () => {
    parent = new DumbParent(state)
    const entity = new DumbEntity(state, { parent })

    expect(countChildren(parent)).toBe(1)
    removeChild(parent, entity.id)
    expect(countChildren(parent)).toBe(0)
  })

  it("finds proper child", () => {
    parent = new DumbParent(state)
    new DumbEntity(state, { parent })
    const entity = new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    removeChild(parent, entity.id)
    expect(getChildren(parent).map(e => e.id)).toMatchSnapshot()
  })
})
describe("#moveChildTo", () => {
  let parent
  const mapChildren = parent => getChildren(parent).map(e => e.id)
  beforeEach(() => {
    parent = new DumbParent(state)
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
  })
  it("moves item down 1 position", () => {
    moveChildTo(parent, 2, 1)
    expect(mapChildren(parent)).toMatchSnapshot()
  })
  it("moves item up 1 position", () => {
    moveChildTo(parent, 2, 3)
    expect(mapChildren(parent)).toMatchSnapshot()
  })
  it("moves item to bottom", () => {
    moveChildTo(parent, 2, 0)
    expect(mapChildren(parent)).toMatchSnapshot()
  })
  it("moves item to top", () => {
    moveChildTo(parent, 2, countChildren(parent) - 1)
    expect(mapChildren(parent)).toMatchSnapshot()
  })
  it("doesn't move anything", () => {
    moveChildTo(parent, 2, 2)
    expect(mapChildren(parent)).toMatchSnapshot()
  })

  it("throws on out of range idx", () => {
    expect(() => moveChildTo(parent, 2, 10)).toThrow()
    expect(() => moveChildTo(parent, -2, 3)).toThrow()
  })
})

test.todo("#countChildren")
describe("#getChildren", () => {
  let parent
  beforeEach(() => {
    parent = new DumbParent(state)
  })
  test("empty parent", () => {
    expect(getChildren(parent)).toMatchSnapshot()
  })
  test("couple of children", () => {
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    expect(getChildren(parent)).toMatchSnapshot()
  })
})

describe("#getChild", () => {
  let parent
  let entity
  it("gets child", () => {
    parent = new DumbParent(state)
    new DumbEntity(state, { parent })
    entity = new DumbEntity(state, { parent })

    expect(getChild(parent, 1)).toBe(entity)
  })
  it.todo("throws if idx out of range")
})

test("#getTop", () => {
  const parent = new DumbParent(state)
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  const entity = new DumbEntity(state, { parent })

  expect(getTop(parent)).toBe(entity)
})
test("#getBottom", () => {
  const parent = new DumbParent(state)
  const entity = new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })

  expect(getBottom(parent)).toBe(entity)
})
// getDescendants is now only used for debugging?
test.todo("#getDescendants")

describe("queryRunner functions", () => {
  describe("#findAll", () => {
    test.todo("finds")
    test.todo("throws")
  })
  describe("#find", () => {
    test.todo("finds")
    test.todo("throws")
  })
})
