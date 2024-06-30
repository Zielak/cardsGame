import { variantParser } from "../variantParser.js"

describe("deep object", () => {
  it("parses single deep field", () => {
    const data = {
      foo$bar: true,
      card$suit: "S",
      card$rank: "A",
      first: 1,
    }

    const result = variantParser(data)

    expect(result["foo"]["bar"]).toBe(true)
    expect(result["card"]["suit"]).toBe("S")
    expect(result["card"]["rank"]).toBe("A")
    expect(result["first"]).toBe(1)
  })
})

it("parses array", () => {
  const data = {
    "card$suit#0": "H",
    "card$suit#1": "D",
    "card$suit#2": "C",
    "card$suit#3": "S",
  }

  const result = variantParser(data)

  expect(typeof result["card"]["suit"]).toBe("object")
  expect(Array.isArray(result["card"]["suit"])).toBe(true)

  expect(result["card"]["suit"][0]).toBe("H")
  expect(result["card"]["suit"][1]).toBe("D")
  expect(result["card"]["suit"][2]).toBe("C")
  expect(result["card"]["suit"][3]).toBe("S")
})
