import {
  standardDeckFactory,
  ClassicCard
} from "../../src/entities/classicCard"
import { State } from "../../src/state"
import { flip, faceUp, faceDown } from "../../src/entities"

let card: ClassicCard
let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
})

afterEach(() => {
  card = null
})

describe("constructor", () => {
  test("sets up defaults", () => {
    card = new ClassicCard({ state, suit: "H", rank: "A" })
    expect(card.faceUp).toBe(false)
  })
})

describe("state changers", () => {
  beforeEach(() => {
    card = new ClassicCard({ state, suit: "H", rank: "A" })
  })
  test("flip", () => {
    expect(card.faceUp).toBe(false)
    flip(card)
    expect(card.faceUp).toBe(true)
    flip(card)
    expect(card.faceUp).toBe(false)
  })
  test("faceUp", () => {
    expect(card.faceUp).toBe(false)
    faceUp(card)
    expect(card.faceUp).toBe(true)
    faceUp(card)
    expect(card.faceUp).toBe(true)
  })
  test("faceDown", () => {
    expect(card.faceUp).toBe(false)
    faceUp(card)
    expect(card.faceUp).toBe(true)
    faceDown(card)
    expect(card.faceUp).toBe(false)
    faceDown(card)
    expect(card.faceUp).toBe(false)
  })
})

describe("standardDeckFactory", () => {
  it("gives 52 proper cards", () => {
    const cards = standardDeckFactory()

    expect(cards.length).toBe(52)
    expect(cards.some(el => el === undefined)).toBeFalsy()
    expect(cards.every(el => typeof el.suit === "string")).toBeTruthy()
    expect(cards.every(el => typeof el.rank === "string")).toBeTruthy()
  })
})
