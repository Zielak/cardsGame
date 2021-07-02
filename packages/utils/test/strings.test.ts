import { camelCase, sentenceCase, trim } from "../src/strings"

describe("trim", () => {
  test(`default arguments`, () => {
    expect(trim()).toBe("")
    expect(trim().length).toBe(0)
    expect(trim("12345678910").length).toBe(7)
  })
  test(`doesn't modify shorter strings`, () => {
    expect(trim("qwe")).toBe("qwe")
    expect(trim("qwe").length).toBe(3)

    expect(trim("1234567890", 20)).toBe("1234567890")
    expect(trim("1234567890", 20).length).toBe(10)
  })
  test(`last character is ellipsis`, () => {
    expect(trim("lorem ipsum", 6)[5]).toBe("…")
    expect(trim("           ", 3)[2]).toBe("…")
  })
})

describe("camelCase", () => {
  test("produces correctly", () => {
    expect(camelCase("foo")).toBe("foo")
    expect(camelCase("foo bar")).toBe("fooBar")
    expect(camelCase("foo bar baz QUX")).toBe("fooBarBazQUX")
  })
  test(`doesn't throw on empty string`, () => {
    expect(() => camelCase()).not.toThrow()
  })
})

describe("sentenceCase", () => {
  test("produces correctly", () => {
    expect(sentenceCase("foo")).toBe("Foo")
    expect(sentenceCase("fooBar")).toBe("FooBar")
    expect(sentenceCase("foo bar")).toBe("Foo Bar")
    expect(sentenceCase("foo bar baz QUX")).toBe("Foo Bar Baz QUX")
  })
  test(`doesn't throw on empty string`, () => {
    expect(() => sentenceCase()).not.toThrow()
  })
})
