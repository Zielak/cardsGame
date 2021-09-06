import { noop, times } from "../src"

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
