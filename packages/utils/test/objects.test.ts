import { deepClone, omit } from "../src/objects"

describe("omit", () => {
  test("works", () => {
    expect(omit({ one: 1, two: 2 }, ["two"])).toStrictEqual({ one: 1 })
  })
})

test("deepClone", () => {
  const source = {
    one: 1,
    arr: ["string"],
    obj: { foo: "bar" },
    func: () => "hello",
  }
  const result = deepClone(source)

  expect(result).toStrictEqual(source)
  expect(result.arr).not.toBe(source.arr)
  expect(result.obj).not.toBe(source.obj)
  expect(result.func).toBe(source.func)
})
