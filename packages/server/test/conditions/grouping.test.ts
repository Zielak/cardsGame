import { getCustomError } from "src/conditions/errors"
import { State } from "src/state"

import { ConditionsMock } from "../helpers/conditionsMock"
import { SmartEntity, SmartParent } from "../helpers/smartEntities"

let state: State
let parent: SmartParent
let con: ConditionsMock<State>

beforeEach(() => {
  state = new State()
  parent = new SmartParent(state, { name: "parent" })

  con = new ConditionsMock<State>(state, { example: "foo" })
})

describe("every", () => {
  beforeEach(() => {
    new SmartEntity(state, { parent, name: "childA" })
    new SmartEntity(state, { parent, name: "childB" })
    new SmartEntity(state, { parent, name: "childC" })
  })
  describe("pass", () => {
    it.todo("tests entities structure")

    it("tests an array", () => {
      expect(() =>
        con()
          .set([5, 10, 15])
          .every((con) => {
            con().is.above(3)
          })
      ).not.toThrow()

      expect(() =>
        con()
          .set([15, 10, 5])
          .every((con) => {
            con().is.above(3)
          })
      ).not.toThrow()
    })
  })

  describe("fail", () => {
    it("tests an array", () => {
      expect(() =>
        con()
          .set([5, 10, 15])
          .every((con) => {
            con().is.above(6)
          })
      ).toThrow()

      expect(() =>
        con()
          .set([15, 10, 5])
          .every((con) => {
            con().is.above(6)
          })
      ).toThrow()
    })

    test("incorrect subject", () => {
      expect(() =>
        con()
          .set("whoops")
          .every((con) => con().empty())
      ).toThrow(/to be an array/)
    })
  })
})

describe("some", () => {
  beforeEach(() => {
    new SmartEntity(state, { parent, name: "childA" })
    new SmartEntity(state, { parent, name: "childB" })
    new SmartEntity(state, { parent, name: "childC" })
  })
  describe("pass", () => {
    it("tests an array", () => {
      expect(() =>
        con()
          .set([5, 10, 15])
          .some((con) => con().equals(10))
      ).not.toThrow()

      expect(() =>
        con()
          .set([15, 10, 5])
          .some((con) => con().equals(10))
      ).not.toThrow()
    })
  })

  describe("fail", () => {
    it("tests an array", () => {
      expect(() =>
        con()
          .set([5, 10, 15])
          .some((con) => con().is.below(5))
      ).toThrow()

      expect(() =>
        con()
          .set([15, 10, 5])
          .some((con) => con().is.below(5))
      ).toThrow()
    })

    test("incorrect subject", () => {
      expect(() =>
        con()
          .set("whoops")
          .some((con) => con().empty())
      ).toThrow(/to be an array/)
    })
  })
})

describe("either", () => {
  describe("pass", () => {
    it("passes on first okay", () => {
      expect(() => {
        con().either(
          () => con().set(1).equals(1),
          () => con().set(0).equals(1),
          () => con().set(0).equals(1)
        )
      }).not.toThrow()
    })

    it("passes on other okay", () => {
      expect(() => {
        con().either(
          () => con().set(0).equals(1),
          () => con().set(0).equals(1),
          () => con().set(1).equals(1)
        )
      }).not.toThrow()
    })

    it("ignores inner errors", () => {
      try {
        con().either(
          () => con("fail 1").set(true).is.false(),
          () => con("fail 2").set(false).is.true()
        )
      } catch (e) {}

      expect(getCustomError(con.getCore())).not.toBeDefined()
    })

    it("returns top custom error", () => {
      try {
        con("none passed").either(
          () => con("zero is one").set(0).equals(1),
          () => con("one is two").set(1).equals(2)
        )
      } catch (e) {}

      expect(getCustomError(con.getCore())).toBe("none passed")
    })
  })
})
