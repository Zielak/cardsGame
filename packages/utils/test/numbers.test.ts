import { limit, rad2deg, wrap, deg2rad, decimal } from "../src/numbers"

describe("limit", () => {
  test("in range", () => {
    expect(limit(0.5)).toBe(0.5)
    expect(limit(0, -10)).toBe(0)
    expect(limit(10, 5, 20)).toBe(10)
  })
  test("on min edge", () => {
    expect(limit(0)).toBe(0)
    expect(limit(-10, -10)).toBe(-10)
  })
  test("on max edge", () => {
    expect(limit(1)).toBe(1)
    expect(limit(10, -20, 10)).toBe(10)
  })
  test("under range", () => {
    expect(limit(-10)).toBe(0)
    expect(limit(-20, -1, 2)).toBe(-1)
  })
  test("over range", () => {
    expect(limit(10)).toBe(1)
    expect(limit(10, -30, -10)).toBe(-10)
  })
})

describe("wrap", () => {})

describe("rad2deg", () => {
  expect(rad2deg(Math.PI)).toBe(180)
  expect(rad2deg(-Math.PI / 2)).toBe(-90)
  expect(rad2deg(0)).toBe(0)
})

describe("deg2rad", () => {
  expect(deg2rad(180)).toBe(Math.PI)
  expect(deg2rad(-90)).toBe(-Math.PI / 2)
  expect(deg2rad(0)).toBe(0)
})

describe("decimal", () => {
  expect(decimal(10)).toBe(10)
  expect(decimal(1.1234)).toBe(1.12)
  expect(decimal(-0.11111111, 4)).toBe(-0.1111)
  expect(decimal(-0.66666666, 5)).toBe(-0.66667)
  expect(decimal(10)).toBe(10)
})
