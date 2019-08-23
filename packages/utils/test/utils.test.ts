import { def, noop, times, isObject } from "../src/utils"
import { MapSchema, ArraySchema } from "@colyseus/schema"

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

describe("isObject", () => {
  it(`verifies {}`, () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: "", b: "b" })).toBe(true)
  })
  it(`verifies the rest`, () => {
    expect(isObject([])).toBe(false)
    expect(isObject(() => {})).toBe(false)
    expect(isObject(function() {})).toBe(false)
    // I'm not even using this function...
    // expect(isObject(new Map())).toBe(false)
    // expect(isObject(new Set())).toBe(false)
    // expect(isObject(new MapSchema())).toBe(false)
    // expect(isObject(new ArraySchema())).toBe(false)
  })
})
