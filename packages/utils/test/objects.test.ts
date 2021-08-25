import { deepClone, omit, pick, resolve } from "../src/objects"

describe("omit", () => {
  test("works", () => {
    expect(omit({ one: 1, two: 2 }, ["two"])).toStrictEqual({ one: 1 })
  })
})

describe("pick", () => {
  test("works", () => {
    expect(pick({ one: 1, two: 2 }, ["two"])).toStrictEqual({ two: 2 })
  })
})

test("deepClone", () => {
  const source = {
    one: 1,
    arr: ["string"],
    obj: { foo: "bar" },
    func: (): string => "hello",
  }
  const result = deepClone(source)

  expect(result).toStrictEqual(source)
  expect(result.arr).not.toBe(source.arr)
  expect(result.obj).not.toBe(source.obj)
  expect(result.func).toBe(source.func)
})

test("resolve", () => {
  const source = {
    one: 1,
    arr: ["string"],
    obj: { foo: "bar" },
    func: (): string => "hello",
  }

  expect(resolve(source, "one")).toBe(1)
  expect(resolve(source, ["one"])).toBe(1)
  expect(resolve(source, "arr")).toBe(source.arr)
  expect(resolve(source, ["arr"])).toBe(source.arr)
  expect(resolve(source, "obj")).toBe(source.obj)
  expect(resolve(source, ["obj"])).toBe(source.obj)
  expect(resolve(source, "func")).toBe(source.func)
  expect(resolve(source, ["func"])).toBe(source.func)

  expect(resolve(source, "arr.0")).toBe(source.arr[0])
  expect(resolve(source, ["arr", 0])).toBe(source.arr[0])
  expect(resolve(source, "obj.foo")).toBe(source.obj.foo)
  expect(resolve(source, ["obj", "foo"])).toBe(source.obj.foo)
})
