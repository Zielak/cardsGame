import { def, isMap, isSet } from "../src/utils"

describe("def", () => {
  it(`returns proper values`, () => {
    expect(def(10, 0)).toBe(10)
    expect(def(undefined, 0)).toBe(0)
  })
})

describe("isMap", () => {
  it(`verifies Map()`, () => {
    expect(isMap(new Map())).toBe(true)
  })
  it(`verifies the rest`, () => {
    expect(isMap([])).toBe(false)
    expect(isMap({})).toBe(false)
    expect(isMap(new Set())).toBe(false)
    expect(isMap("")).toBe(false)
  })
})

describe("isSet", () => {
  it(`verifies Map()`, () => {
    expect(isSet(new Set())).toBe(true)
  })
  it(`verifies the rest`, () => {
    expect(isSet([])).toBe(false)
    expect(isSet({})).toBe(false)
    expect(isSet(new Map())).toBe(false)
    expect(isSet("")).toBe(false)
  })
})
