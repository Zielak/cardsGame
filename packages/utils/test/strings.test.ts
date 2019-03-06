import { trim, randomName, camelCase, sentenceCase } from "../src/strings"

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
  test(`doesn't fail on empty string`, () => {
    expect(camelCase).not.toThrow()
  })
})
