import { randomFloat, randomInt } from "../src"

test("randomFloat", () => {
  expect(() => randomFloat()).not.toThrow()
  expect(typeof randomFloat()).toBe("number")
})

test("randomInt", () => {
  expect(() => randomInt()).not.toThrow()
  expect(typeof randomInt()).toBe("number")
  expect(Number.isInteger(randomInt(0, 10))).toBeTruthy()
})
