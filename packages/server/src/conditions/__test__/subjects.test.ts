import { Line } from "@/entities/line.js"
import { State } from "@/state/state.js"

import {
  SmartEntity,
  SmartParent,
} from "../../__test__/helpers/smartEntities.js"
import { Conditions } from "../conditions.js"
import { prepareConditionsContext } from "../context/utils.js"

import { ConditionsTest } from "./conditions.js"

let state: State
let parent: SmartParent
let con: ConditionsTest
let childA: SmartEntity
let childB: SmartEntity
let childC: SmartEntity

beforeEach(() => {
  state = new State()
  parent = new SmartParent(state, { name: "parent" })

  con = new Conditions(prepareConditionsContext(state, { example: "foo" }))

  childA = new SmartEntity(state, { parent, name: "childA" })
  childB = new SmartEntity(state, { parent, name: "childB" })
  childC = new SmartEntity(state, { parent, name: "childC" })
})

describe("its", () => {
  it("works with state", () => {
    expect(con().its("type").grab()).toBe("state")
    expect(con().its("turnBased").grab()).toBe(true)
  })
  it("works with object", () => {
    const o = {
      one: 1,
      two: 2,
      three: 3,
    }
    expect(con().set(o).its("one").grab()).toBe(1)
  })
  it("works with maps", () => {
    const map = new Map([
      ["one", 1],
      ["two", 2],
      ["three", 3],
    ])
    expect(con().set(map).its("one").grab()).toBe(1)
  })
  it("is possible to chain assertions", () => {
    expect(
      () => con().its("type").equals("state").and.its("turnBased").true,
    ).not.toThrow()
  })
  it("is possible to go deep", () => {
    state.ui.set("type", "string in UI")

    expect(con().its("ui").its("type").grab()).toBe("string in UI")
  })
  it("works with 'every'", () => {
    const cards = [
      { rank: 3, suit: "H" },
      { rank: 6, suit: "H" },
    ]
    expect(() => {
      con()
        .set(cards)
        .every((con) => {
          con().its("rank").above(2)
          con().its("suit").equals("H")
          con().its("rank").above(2).and.its("suit").equals("H")
        })
    }).not.toThrow()
  })
})

describe("parent", () => {
  beforeEach(() => {
    new SmartEntity(state, { name: "childRoot" })
  })
  describe("pass", () => {
    it("changes subject to parent", () => {
      // Grab a parent entity
      expect(con().query({ name: "childA" }).parent.grab()).toBe(parent)
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
      const stateGrabbed = con().children.grab<[]>()
      const stateChildren = state.getChildren()
      stateGrabbed.forEach((a, i) => {
        expect(stateChildren[i]).toBe(a)
      })

      // Children of parent entity
      const parentGrabbed = con().set(parent).children.grab<[]>()
      const parentChildren = parent.getChildren()
      parentGrabbed.forEach((a, i) => {
        expect(parentChildren[i]).toBe(a)
      })
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
    it("grabs child of ArraySchema", () => {
      state.clients.push("clientA")
      state.clients.push("clientB")

      expect(() => con().its("clients").nthChild(0)).not.toThrow()

      expect(con().its("clients").nthChild(0).grab()).toBe("clientA")
      expect(con().its("clients").nthChild(1).grab()).toBe("clientB")
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

describe("top", () => {
  describe("pass", () => {
    it("grabs child of Parent", () => {
      expect(con().set(parent).top.grab()).toBe(childC)
    })
    it("grabs child of array", () => {
      const array = ["zero", 1, []]

      expect(con().set(array).top.grab()).toBe(array[2])
    })
    it("grabs child of ArraySchema", () => {
      state.clients.push("clientA")
      state.clients.push("clientB")

      expect(() => con().its("clients").top).not.toThrow()
      expect(con().its("clients").top.grab()).toBe("clientB")
    })
    it("test on Line, as it has 'length' property", () => {
      const line = new Line(state)
      line.addChildren([childA, childB, childC])

      expect(con().set(line).top.grab()).toBe(childC)
    })
  })

  describe("fail", () => {
    it("fails on unexpected values", () => {
      expect(() => con().set("qwerty").top).toThrow()
      expect(() => con().set(123).top).toThrow()
    })
  })
})

describe("bottom", () => {
  describe("pass", () => {
    it("grabs child of Parent", () => {
      expect(con().set(parent).bottom.grab()).toBe(childA)
    })
    it("grabs child of array", () => {
      const array = ["zero", 1, []]

      expect(con().set(array).bottom.grab()).toBe(array[0])
    })
    it("grabs child of ArraySchema", () => {
      state.clients.push("clientA")
      state.clients.push("clientB")

      expect(() => con().its("clients").bottom).not.toThrow()
      expect(con().its("clients").bottom.grab()).toBe("clientA")
    })
    it("test on Line, as it has 'length' property", () => {
      const line = new Line(state)
      line.addChildren([childA, childB, childC])

      expect(con().set(line).bottom.grab()).toBe(childA)
    })
  })

  describe("fail", () => {
    it("fails on unexpected values", () => {
      expect(() => con().set("qwerty").bottom).toThrow()
      expect(() => con().set(123).bottom).toThrow()
    })
  })
})

describe("idx", () => {
  describe("pass", () => {
    it("grabs idx of child", () => {
      expect(() => con().set(childA).idx.equals(0)).not.toThrow()
      expect(() => con().set(childB).idx.equals(1)).not.toThrow()
      expect(() => con().set(childC).idx.equals(2)).not.toThrow()
    })

    it("also works on parent", () => {
      expect(() => con().set(parent).idx.equals(0)).not.toThrow()
    })
  })

  describe("fail", () => {
    it("on unexpected subjects", () => {
      const reason = "Expected subject to be a child"

      expect(() => con().set(123).idx.equals(0)).toThrow(reason)
      expect(() => con().set("childB").idx.equals(0)).toThrow(reason)
      expect(() => con().set([1, 2, 3, 4]).idx.equals(0)).toThrow(reason)
      expect(() => con().idx.equals(0)).toThrow(reason)
    })
  })
})

describe("subject references", () => {
  describe("get/as", () => {
    it("works", () => {
      con().set(childB).as("CHILDB")

      expect(con().get("CHILDB").grab()).toBe(childB)
    })
    it("throws", () => {
      expect(() => con().get("whoops").grab()).toThrow("nothing")
    })
  })
  describe("remember", () => {
    it("works", () => {
      con().remember("CHILDB", { name: "childB" })

      expect(con().get("CHILDB").grab()).toBe(childB)
    })
  })
})
