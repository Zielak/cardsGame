import { def, noop, times } from "../src/utils"

describe("noop", () => {
  test(`is a function`, () => {
    expect(typeof noop).toBe("function")
  })
  test(`can be called`, () => {
    expect(noop).not.toThrow()
  })
  test(`returns undefined`, () => {
    expect(noop()).toBe(undefined)
  })
})

describe("def", () => {})

describe("times", () => {
  test(`calls function some times`, () => {
    const spy = jest.fn()
    times(3, spy)
    expect(spy).toHaveBeenCalledTimes(3)
  })
  test(`calls exactly 1 time`, () => {
    const spy = jest.fn()
    times(1, spy)
    expect(spy).toHaveBeenCalledTimes(1)
  })
  test(`doesn't call on incorrect length`, () => {
    const spy = jest.fn()

    times(0, spy)
    times(-3, spy)
    times(NaN, spy)
    times(-Infinity, spy)
    expect(spy).not.toBeCalled()

    expect(() => times(Infinity, noop)).toThrow()
  })
})
