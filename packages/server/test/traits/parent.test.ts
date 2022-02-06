import { State } from "src/state"
import type { ParentTrait } from "src/traits/parent"

import { DumbEntity, DumbParent } from "../helpers/dumbEntities"

let state: State
let parent: ParentTrait

beforeEach(() => {
  state = new State()
  parent = new DumbParent(state)
  new DumbEntity(state, { parent }) // 0
  new DumbEntity(state, { parent }) // 1
  new DumbEntity(state, { parent }) // 2

  parent["hooks"].set("childAdded", [jest.fn()])
  parent["hooks"].set("childRemoved", [jest.fn()])
  parent["hooks"].set("childIndexUpdated", [jest.fn()])
})

describe("hooks", () => {
  describe("childRemoved", () => {
    it("gets called with index of removed item", () => {
      const spy = parent["hooks"].get("childRemoved")[0]
      parent.removeChildAt(2)

      expect(spy).toHaveBeenCalledWith(2)
    })
  })

  describe("childIndexUpdated", () => {
    it("isn't called when removing last child", () => {
      const spy = parent["hooks"].get("childIndexUpdated")[0]
      parent.removeChildAt(2)

      expect(spy).not.toHaveBeenCalled()
    })

    it("gets called multiple times, when removing first item in array mode", () => {
      const spy = parent["hooks"].get("childIndexUpdated")[0]
      expect(parent.countChildren()).toBe(3)
      parent.removeChildAt(0)

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenNthCalledWith<[number, number]>(1, 1, 0)
      expect(spy).toHaveBeenNthCalledWith<[number, number]>(2, 2, 1)
    })
  })
})
