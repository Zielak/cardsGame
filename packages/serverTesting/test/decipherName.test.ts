import { decipherName } from "src/decipherName"
import type { EntityMockingDefinition } from "src/types"

let entity: EntityMockingDefinition
let target: Record<string, any>

beforeEach(() => {
  entity = {}
  target = {}
})

it("creates new object if no targetObject provided", () => {
  expect(() => decipherName(entity)).not.toThrow()
  expect(decipherName(entity)).toStrictEqual({})
})

it("modifies targetObject in place", () => {
  target = { someOtherThing: true }
  expect(decipherName(entity, target)).toStrictEqual(target)
})

it("defaults to classicCard type", () => {
  entity.name = "SK"
  target = decipherName(entity, target)

  expect(target.suit).toBe("S")
  expect(target.rank).toBe("K")
})

describe("values for card", () => {
  test("single digit rank", () => {
    entity.type = "classicCard"
    entity.name = "D7"
    target = decipherName(entity, target)

    expect(target.suit).toBe("D")
    expect(target.rank).toBe("7")
  })
  test("double digit rank", () => {
    entity.type = "classicCard"
    entity.name = "C10"
    target = decipherName(entity, target)

    expect(target.suit).toBe("C")
    expect(target.rank).toBe("10")
  })
})
