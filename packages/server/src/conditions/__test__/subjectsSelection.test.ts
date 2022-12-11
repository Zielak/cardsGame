import { DumbEntity, DumbParent } from "../../__test__/helpers/dumbEntities.js"
import { SelectableParent } from "../../__test__/helpers/selectableParent.js"
import { SmartEntity } from "../../__test__/helpers/smartEntities.js"
import { State } from "../../state/state.js"

import { ConditionsTest } from "./conditions.js"

let state: State
let parent: SelectableParent
let con: ConditionsTest<State>
let childA: SmartEntity
let childB: SmartEntity
let childC: SmartEntity
let childD: SmartEntity
let invalidParent: DumbParent
let invalidChildA: DumbEntity

SelectableParent

beforeEach(() => {
  state = new State()
  parent = new SelectableParent(state, {})

  con = new ConditionsTest<State>(state, { example: "foo" })

  childA = new SmartEntity(state, { parent, name: "childA" })
  childB = new SmartEntity(state, { parent, name: "childB" })
  childC = new SmartEntity(state, { parent, name: "childC" })
  childD = new SmartEntity(state, { parent, name: "childD" })

  parent.selectChildAt(3) // childD, selectionIdx: 0
  parent.selectChildAt(1) // childB, selectionIdx: 1

  // Invalid parent
  invalidParent = new DumbParent(state)
  invalidChildA = new DumbEntity(state, { parent: invalidParent })
})

describe("selectionIndex", () => {
  describe("pass", () => {
    it("on selectable children", () => {
      expect(() => con().set(childB).selectionIndex.equals(1)).not.toThrow()
      expect(() => con().set(childD).selectionIndex.equals(0)).not.toThrow()

      expect(() => con().set(childA).selectionIndex.equals(0)).toThrow()
      expect(() => con().set(childC).selectionIndex.equals(0)).toThrow()
    })
  })

  describe("fail", () => {
    it("on parent without selectableChildrenTrai", () => {
      const reason = "Parent without ability to select children"

      expect(() => con().set(invalidChildA).selectionIndex.equals(0)).toThrow(
        reason
      )
    })

    it("on unexpected subjects", () => {
      const reason = "Expected subject to be a child"

      expect(() => con().set(123).selectionIndex.equals(0)).toThrow(reason)
      expect(() => con().set("childB").selectionIndex.equals(0)).toThrow(reason)
      expect(() => con().set([1, 2, 3, 4]).selectionIndex.equals(0)).toThrow(
        reason
      )
      expect(() => con().selectionIndex.equals(0)).toThrow(reason)
    })
  })
})
