import { Conditions } from "../../src/conditions"
import { State } from "../../src/state/state"
import { SmartEntity, SmartParent } from "../helpers/smartEntities"

let state: State
let parent: SmartParent
let con: Conditions<State>

beforeEach(() => {
  state = new State()
  parent = new SmartParent(state, { name: "parent" })

  con = new Conditions<State>(state, {} as any)
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
        con.set([5, 10, 15]).every((con) => {
          con.is.above(3)
        })
      ).not.toThrow()

      expect(() =>
        con.set([15, 10, 5]).every((con) => {
          con.is.above(3)
        })
      ).not.toThrow()
    })
  })

  describe("fail", () => {
    it("tests an array", () => {
      expect(() =>
        con.set([5, 10, 15]).every((con) => {
          con.is.above(6)
        })
      ).toThrow()

      expect(() =>
        con.set([15, 10, 5]).every((con) => {
          con.is.above(6)
        })
      ).toThrow()
    })

    test("incorrect subject", () => {
      expect(() => con.set("whoops").every((con) => con.empty())).toThrow(
        /to be an array/
      )
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
        con.set([5, 10, 15]).some((con) => con.equals(10))
      ).not.toThrow()

      expect(() =>
        con.set([15, 10, 5]).some((con) => con.equals(10))
      ).not.toThrow()
    })
  })

  describe("fail", () => {
    it("tests an array", () => {
      expect(() =>
        con.set([5, 10, 15]).some((con) => con.is.below(5))
      ).toThrow()

      expect(() =>
        con.set([15, 10, 5]).some((con) => con.is.below(5))
      ).toThrow()
    })

    test("incorrect subject", () => {
      expect(() => con.set("whoops").some((con) => con.empty())).toThrow(
        /to be an array/
      )
    })
  })
})

describe("either", () => {
  describe("pass", () => {
    it("passes on first okay", () => {
      expect(() => {
        con.either(
          () => con.set(1).equals(1),
          () => con.set(0).equals(1),
          () => con.set(0).equals(1)
        )
      }).not.toThrow()
    })

    it("passes on other okay", () => {
      expect(() => {
        con.either(
          () => con.set(0).equals(1),
          () => con.set(0).equals(1),
          () => con.set(1).equals(1)
        )
      }).not.toThrow()
    })
  })
})
