import { def, isMap, isSet, noop, times } from "../src/utils"

describe("noop", () => {
  it(`is a function`, () => {
    expect(typeof noop).toBe("function")
  })
  it(`can be called`, () => {
    expect(noop).not.toThrow()
  })
  it(`returns undefined`, () => {
    expect(noop()).toBe(undefined)
  })
})

describe("def", () => {
  it(`returns proper values`, () => {
    expect(def(10, 0)).toBe(10)
    expect(def(undefined, 0)).toBe(0)
  })
})

describe("times", () => {
  it(`calls function some times`, () => {
    const spy = jest.fn()
    times(3, spy)
    expect(spy).toHaveBeenCalledTimes(3)
  })
  it(`calls exactly 1 time`, () => {
    const spy = jest.fn()
    times(1, spy)
    expect(spy).toHaveBeenCalledTimes(1)
  })
  it(`doesn't call on incorrect length`, () => {
    const spy = jest.fn()

    times(0, spy)
    times(-3, spy)
    times(NaN, spy)
    times(-Infinity, spy)
    expect(spy).not.toBeCalled()

    expect(() => times(Infinity, noop)).toThrow()
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
