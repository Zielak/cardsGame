import {
  DumbArrayParent,
  DumbEntity,
  DumbMapParent
} from "../helpers/dumbEntities"
import { IdentityTrait } from "../../src/traits/identity"
import { ChildTrait } from "../../src/traits/child"
import { State } from "../../src/state"

let state: State

beforeEach(() => {
  state = new State()
})

describe("ParentConstructor", () => {
  test("sets default properties", () => {
    const parent = new DumbArrayParent(state)

    expect(parent.countChildren()).toBe(0)

    expect(parent.hijacksInteractionTarget).toBeDefined()
    expect(parent.hijacksInteractionTarget).toBe(true)
  })
})

describe("#removeChildAt", () => {
  let parent: DumbArrayParent
  beforeEach(() => {
    parent = new DumbArrayParent(state)
  })
  it(`throws on invalid "idx"`, () => {
    expect(parent.removeChildAt(-2)).toBe(false)
    expect(parent.removeChildAt(NaN)).toBe(false)
    expect(parent.removeChildAt(Infinity)).toBe(false)
    expect(parent.removeChildAt(10)).toBe(false)
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
  let parent: DumbArrayParent
  it("calls removeChildAt", () => {
    parent = new DumbArrayParent(state)
    const entity = new DumbEntity(state, { parent })

    expect(parent.countChildren()).toBe(1)
    expect(parent.removeChild(entity)).toBe(true)
    expect(parent.countChildren()).toBe(0)
  })

  it("finds proper child", () => {
    parent = new DumbArrayParent(state)
    new DumbEntity(state, { parent })
    const entity = new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    parent.removeChild(entity)
    expect(
      parent.getChildren().map((e: ChildTrait & IdentityTrait) => e.id)
    ).toMatchSnapshot()
  })
})

describe("#addChild", () => {
  let parent: DumbArrayParent
  let entity: DumbEntity
  beforeEach(() => {
    parent = new DumbArrayParent(state)
    new DumbEntity(state, { parent })
  })
  it("adds new item", () => {
    entity = new DumbEntity(state)
    parent.addChild(entity)

    expect(entity.parent).toBe(parent)
    expect(entity.idx).toBe(1)
    expect(parent.countChildren()).toBe(2)
  })
  it("prepends new item", () => {
    entity = new DumbEntity(state)
    parent.addChild(entity, true)

    expect(entity.parent).toBe(parent)
    expect(entity.idx).toBe(0)
    expect(parent.countChildren()).toBe(2)
  })
})

describe("#moveChildTo", () => {
  const mapArrayChildren = p => p.getChildren().map(e => (e ? e.id : null))

  let parent: DumbArrayParent
  beforeEach(() => {
    parent = new DumbArrayParent(state)
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
  })
  it("moves item3 down 1 position", () => {
    parent.moveChildTo(2, 1)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("moves item3 up 1 position", () => {
    parent.moveChildTo(2, 3)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("moves item3 to bottom", () => {
    parent.moveChildTo(2, 0)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("moves item3 to top", () => {
    parent.moveChildTo(2, parent.countChildren() - 1)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("doesn't move anything (item3 to same position)", () => {
    parent.moveChildTo(2, 2)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("handles too high 'to' number, treats as max value", () => {
    expect(() => parent.moveChildTo(2, 10)).not.toThrow()
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })

  it("throws on out of range idx", () => {
    expect(() => parent.moveChildTo(-2, 3)).toThrow()
  })
})

test.todo("#countChildren")
describe("#getChildren", () => {
  let parent: DumbArrayParent
  beforeEach(() => {
    parent = new DumbArrayParent(state)
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
  describe("ArrayParent", () => {
    let parent
    let entity

    beforeEach(() => {
      parent = new DumbMapParent(state)
    })
    it("gets child", () => {
      new DumbEntity(state, { parent })
      entity = new DumbEntity(state, { parent })

      expect(parent.getChild(1)).toBe(entity)
    })
    it.todo("gets nothing")
    it.todo("throws if idx out of range")
  })
})

describe("#getTop", () => {
  test("ArrayParent", () => {
    const parent = new DumbArrayParent(state)
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    const entity = new DumbEntity(state, { parent })

    expect(parent.getTop()).toBe(entity)
  })
})

test("#getBottom", () => {
  const parent = new DumbArrayParent(state)
  const entity = new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })

  expect(parent.getBottom()).toBe(entity)
})
