import { State } from "../../src/state/state"
import { ConditionsMock } from "../helpers/conditionsMock"
import { SmartEntity, SmartParent } from "../helpers/smartEntities"

let state: State
let parent: SmartParent
let con: ConditionsMock<State>
let childA: SmartEntity
let childB: SmartEntity
let childC: SmartEntity

beforeEach(() => {
  state = new State()
  parent = new SmartParent(state, { name: "parent" })

  con = new ConditionsMock<State>(state, { $example: "foo" })

  childA = new SmartEntity(state, { parent, name: "childA" })
  childB = new SmartEntity(state, { parent, name: "childB" })
  childC = new SmartEntity(state, { parent, name: "childC" })
})

describe("its", () => {
  it("grabs correct references", () => {
    expect(con().its("type").grab()).toBe("state")
    expect(con().its("turnBased").grab()).toBe(true)
  })
  it("'s possible to chain assertions", () => {
    expect(
      () => con().its("type").equals("state").and.its("turnBased").true
    ).not.toThrow()
  })
})

describe("parent", () => {
  beforeEach(() => {
    new SmartEntity(state, { name: "childRoot" })
  })
  describe("pass", () => {
    it("changes subject to parent", () => {
      // Grab a parent entity
      expect(con().get({ name: "childA" }).parent.grab()).toBe(parent)
      // Grab the state as parent
      expect(con().bottom.parent.grab()).toBe(state)
    })
  })
  describe("fail", () => {
    it("throws on root child entity", () => {
      expect(() => con().parent).toThrow("Subject is the root state")
    })
  })
})

describe("children", () => {
  describe("pass", () => {
    it("changes the subject to array of children", () => {
      // Children of the state
      expect(con().children.grab()).toBe(state.getChildren())
      // Children of parent entity
      expect(con().set(parent).children.grab()).toBe(parent.getChildren())
    })
  })

  describe("fail", () => {
    it("fails on entity without children", () => {
      expect(() => con().set(childA).children).toThrow("can't have children")
    })
  })
})

describe("nthChild", () => {
  describe("pass", () => {
    it("grabs child of Parent", () => {
      expect(con().set(parent).nthChild(0).grab()).toBe(childA)
      expect(con().set(parent).nthChild(1).grab()).toBe(childB)
      expect(con().set(parent).nthChild(2).grab()).toBe(childC)
    })
    it("grabs child of array", () => {
      const array = ["zero", 1, []]

      expect(con().set(array).nthChild(0).grab()).toBe(array[0])
      expect(con().set(array).nthChild(1).grab()).toBe(array[1])
      expect(con().set(array).nthChild(2).grab()).toBe(array[2])
    })
  })

  describe("fail", () => {
    it("fails out of bounds", () => {
      const array = ["zero", 1, []]

      expect(() => con().set(parent).nthChild(-1)).toThrow("Out of bounds")
      expect(() => con().set(parent).nthChild(5)).toThrow("Out of bounds")

      expect(() => con().set(array).nthChild(-2)).toThrow("Out of bounds")
      expect(() => con().set(array).nthChild(10)).toThrow("Out of bounds")
    })
  })
})
