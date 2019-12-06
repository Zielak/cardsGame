import { SelectableParent } from "../helpers/selectableParent"
import { State } from "../../src/state"
import { DumbEntity } from "../helpers/dumbEntities"

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

describe("selectChildAt", () => {
  it("changes", () => {
    parent.selectChildAt(0)
    expect(parent.selectedChildren[0]).toBeTruthy()
    expect(parent.isChildSelected(0)).toBeTruthy()

    parent.selectChildAt(4)
    expect(parent.selectedChildren[4]).toBeTruthy()
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
    parent.selectedChildren[0] = true
    expect(parent.isChildSelected(0)).toBeTruthy()

    parent.deselectChildAt(0)
    expect(parent.selectedChildren[0]).toBeFalsy()
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

it("counts", () => {
  parent.selectedChildren[0] = true
  parent.selectedChildren[4] = true

  expect(parent.countSelectedChildren()).toBe(2)
  expect(parent.countUnselectedChildren()).toBe(3)
})
