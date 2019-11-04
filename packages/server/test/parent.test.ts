import { DumbParent, DumbEntity } from "./helpers/dumbEntities"
import { State } from "../src/state"
import { IdentityTrait, ChildTrait } from "../src/traits"

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
  const mapChildren = parent => parent.getChildren().map(e => e.id)
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
  describe("#findAll", () => {
    test.todo("finds")
    test.todo("throws")
  })
  describe("#find", () => {
    test.todo("finds")
    test.todo("throws")
  })
})
