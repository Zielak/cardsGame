import {
  ParentConstructor,
  getChild,
  getChildren,
  removeChildAt,
  countChildren
} from "../src/entities/traits/parent"
import { DumbParent, ConstructedParent } from "./helpers/dumbParent"
import { State } from "../src/state"
import { ConstructedEntity } from "./helpers/dumbEntity"

let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
})

describe("ParentConstructor", () => {
  test("sets _childrenPointers", () => {
    let parent = new DumbParent()
    ParentConstructor(parent)

    expect(parent._childrenPointers).toBeDefined()
    expect(parent._childrenPointers.length).toBe(0)
  })
})

describe("#removeChildAt", () => {
  let parent
  beforeEach(() => {
    parent = new ConstructedParent({ state })
  })
  it("throws on invalid `idx`", () => {
    expect(() => removeChildAt(parent, -2)).toThrow()
    expect(() => removeChildAt(parent, NaN)).toThrow()
    expect(() => removeChildAt(parent, Infinity)).toThrow()
    expect(() => removeChildAt(parent, 10)).toThrow()
  })
  it("removes the only child", () => {
    new ConstructedEntity({ state, parent })

    expect(countChildren(parent)).toBe(1)
    expect(removeChildAt(parent, 0)).toBe(true)
    expect(countChildren(parent)).toBe(0)
  })
  it("removes child in the middle", () => {
    new ConstructedEntity({ state, parent })
    new ConstructedEntity({ state, parent })
    new ConstructedEntity({ state, parent })

    expect(countChildren(parent)).toBe(3)
    expect(removeChildAt(parent, 1)).toBe(true)
    expect(parent._childrenPointers.length).toBe(2)
    expect(countChildren(parent)).toBe(2)
  })
})
test.todo("#removeChild")
test.todo("#moveChildTo")

test.todo("#restyleChildren")

test.todo("#countChildren")
describe("#getChildren", () => {
  let parent
  beforeEach(() => {
    parent = new ConstructedParent({ state })
  })
  test("empty parent", () => {
    expect(getChildren(parent)).toMatchSnapshot()
  })
  test("couple of children", () => {
    new ConstructedEntity({ state, parent })
    new ConstructedEntity({ state, parent })
    new ConstructedEntity({ state, parent })
    new ConstructedEntity({ state, parent })
    new ConstructedEntity({ state, parent })

    expect(getChildren(parent)).toMatchSnapshot()
  })
})
test.todo("#getChild")
test.todo("#getTop")
test.todo("#getBottom")
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
