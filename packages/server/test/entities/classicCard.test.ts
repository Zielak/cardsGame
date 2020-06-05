import {
  ClassicCard,
  standardDeckFactory,
} from "../../src/entities/classicCard"
import { State } from "../../src/state/state"

let card: ClassicCard
let state: State

beforeEach(() => {
  state = new State()
})

afterEach(() => {
  card = null
})

describe("constructor", () => {
  test("sets up defaults", () => {
    card = new ClassicCard(state, { suit: "H", rank: "A" })

    expect(card).toMatchSnapshot()
  })
})

describe("state changers", () => {
  beforeEach(() => {
    card = new ClassicCard(state, { suit: "H", rank: "A" })
  })
  test("flip", () => {
    expect(card.faceUp).toBe(false)
    card.flip()
    expect(card.faceUp).toBe(true)
    card.flip()
    expect(card.faceUp).toBe(false)
  })
  test("faceUp", () => {
    expect(card.faceUp).toBe(false)
    card.flipUp()
    expect(card.faceUp).toBe(true)
    card.flipUp()
    expect(card.faceUp).toBe(true)
  })
  test("faceDown", () => {
    expect(card.faceUp).toBe(false)
    card.flipUp()
    expect(card.faceUp).toBe(true)
    card.flipDown()
    expect(card.faceUp).toBe(false)
    card.flipDown()
    expect(card.faceUp).toBe(false)
  })
})

describe("standardDeckFactory", () => {
  it("gives 52 proper cards", () => {
    const cards = standardDeckFactory()

    expect(cards.length).toBe(52)
    expect(cards.some((el) => el === undefined)).toBeFalsy()
    expect(cards.every((el) => typeof el.suit === "string")).toBeTruthy()
    expect(cards.every((el) => typeof el.rank === "string")).toBeTruthy()
  })
})
