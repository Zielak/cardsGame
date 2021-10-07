import { State } from "../../src/state"
import { DumbEntity } from "../helpers/dumbEntities"
import { SelectableParent } from "../helpers/selectableParent"

let state: State
let parent: SelectableParent

beforeEach(() => {
  state = new State()
  parent = new SelectableParent(state)

  // 5 children
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
})

describe("constructor", () => {
  it("has selectedChildren property", () => {
    const p = new SelectableParent(state)
    expect(p.selectedChildren).toBeDefined()
    expect(p.selectedChildren.length).toBe(0)
  })
})

describe("hooks", () => {
  describe("childRemoved", () => {
    it("fixes up indexes of other children", () => {
      parent.selectChildAt(1)
      parent.selectChildAt(3)

      parent.removeChildAt(1)

      expect(parent.selectedChildren.length).toBe(1)
      expect(parent.selectedChildren[0].childIndex).toBe(2)
      expect(parent.isChildSelected(2)).toBe(true)
    })
  })

  describe("childIndexUpdated", () => {
    it("fixes up indexes of other children", () => {
      parent.selectChildAt(3)

      const newItem = new DumbEntity(state)
      parent.addChild(newItem, true)

      expect(parent.selectedChildren.length).toBe(1)
      expect(parent.selectedChildren[0].childIndex).toBe(4)
      expect(parent.isChildSelected(4)).toBe(true)
    })
  })
})

describe("selectChildAt", () => {
  it("changes", () => {
    parent.selectChildAt(0)
    expect(parent.isChildSelected(0)).toBeTruthy()

    parent.selectChildAt(4)
    expect(parent.isChildSelected(4)).toBeTruthy()
  })

  it("throws", () => {
    expect(() => parent.selectChildAt(-5)).toThrow()
    expect(() => parent.selectChildAt(100)).toThrow()
    expect(() => parent.selectChildAt(Infinity)).toThrow()
    expect(() => parent.selectChildAt(undefined)).toThrow()
    expect(() => parent.selectChildAt(null)).toThrow()
  })
})

describe("deselectChildAt", () => {
  it("changes", () => {
    parent.selectChildAt(0)
    expect(parent.isChildSelected(0)).toBeTruthy()

    parent.deselectChildAt(0)
    expect(parent.isChildSelected(0)).toBeFalsy()
  })

  it("throws", () => {
    expect(() => parent.deselectChildAt(-5)).toThrow()
    expect(() => parent.deselectChildAt(100)).toThrow()
    expect(() => parent.deselectChildAt(Infinity)).toThrow()
    expect(() => parent.deselectChildAt(undefined)).toThrow()
    expect(() => parent.deselectChildAt(null)).toThrow()
  })
})

describe("getSelectedChildren", () => {
  it("works", () => {
    parent.selectChildAt(1)
    parent.selectChildAt(4)
    const selected = parent.getSelectedChildren()

    expect(selected.length).toBe(2)
    expect(selected[0].idx).toBe(1)
    expect(selected[1].idx).toBe(4)
  })
})

describe("getUnselectedChildren", () => {
  it("works", () => {
    parent.selectChildAt(1)
    parent.selectChildAt(3)
    const unselected = parent.getUnselectedChildren()

    expect(unselected.length).toBe(3)
    expect(unselected[0].idx).toBe(0)
    expect(unselected[1].idx).toBe(2)
    expect(unselected[2].idx).toBe(4)
  })
})

describe("counting", () => {
  it("counts", () => {
    parent.selectChildAt(0)
    parent.selectChildAt(4)

    expect(parent.countSelectedChildren()).toBe(2)
    expect(parent.countUnselectedChildren()).toBe(3)
  })
})
