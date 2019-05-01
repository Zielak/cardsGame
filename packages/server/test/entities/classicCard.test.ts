import { standardDeckFactory } from "../../src/entities/classicCard"

describe("standardDeckFactory", () => {
  it("gives 52 proper cards", () => {
    const cards = standardDeckFactory()

    expect(cards.length).toBe(52)
    expect(cards.some(el => el === undefined)).toBeFalsy()
    expect(cards.every(el => typeof el.suit === "string")).toBeTruthy()
    expect(cards.every(el => typeof el.rank === "string")).toBeTruthy()
  })
})
