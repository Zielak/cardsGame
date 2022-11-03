import { standardDeckFactory } from "../../utils/cards.js"

describe("standardDeckFactory", () => {
  it("gives data for 52 cards", () => {
    const cards = standardDeckFactory()

    expect(cards.length).toBe(52)
    expect(cards.some((el) => el === undefined)).toBeFalsy()
    expect(cards.every((el) => typeof el.suit === "string")).toBeTruthy()
    expect(cards.every((el) => typeof el.rank === "string")).toBeTruthy()
  })

  it("respects arrays", () => {
    const cards = standardDeckFactory(["2", "3"], ["H", "C"])

    expect(cards.length).toBe(4)
    expect(cards).toMatchSnapshot()
  })

  it("respects sets", () => {
    const cards = standardDeckFactory(new Set(["2", "3"]), new Set(["H", "C"]))

    expect(cards.length).toBe(4)
    expect(cards).toMatchSnapshot()
  })
})
