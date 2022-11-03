import { objectsNamed, childrenNamed } from "../entityDefinitionHelpers.js"

describe("objectsNamed", () => {
  it("just makes plain objects", () => {
    expect(objectsNamed(["SK", "C10", "Bob"])).toStrictEqual([
      { name: "SK" },
      { name: "C10" },
      { name: "Bob" },
    ])
  })

  it("still makes array, given empty array", () => {
    expect(objectsNamed([])).toStrictEqual([])
  })

  it("accepts single string value", () => {
    expect(objectsNamed("test")).toStrictEqual([{ name: "test" }])
  })
})

describe("childrenNamed", () => {
  it("makes object with children prop populated", () => {
    expect(childrenNamed(["SK", "C10", "Bob"])).toStrictEqual({
      children: [{ name: "SK" }, { name: "C10" }, { name: "Bob" }],
    })
  })

  it("still makes object of children, given empty array", () => {
    expect(childrenNamed([])).toStrictEqual({
      children: [],
    })
  })

  it("accepts single string value", () => {
    expect(childrenNamed("test")).toStrictEqual({
      children: [{ name: "test" }],
    })
  })
})
