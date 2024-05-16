import { variantParser } from "../variantParser.js"

describe("deep object", () => {
  it("parses single deep field", () => {
    const data = {
      "foo.bar": true,
      "card.suit": "S",
      "card.rank": "A",
      first: 1,
    }
    const result = variantParser(data)
    expect(result["foo"]["bar"]).toBe(true)
    expect(result["card"]["suit"]).toBe("S")
    expect(result["card"]["rank"]).toBe("A")
    expect(result["first"]).toBe(1)
  })
})
