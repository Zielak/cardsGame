import { State } from "../../state/state.js"
import { ClassicCard } from "../classicCard.js"

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
