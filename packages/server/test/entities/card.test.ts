import { Card, State } from "../../index"

let card: Card
let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
  card = new Card({ state })
})

afterEach(() => {
  card = null
})

describe("constructor", () => {
  test("sets up defaults", () => {
    expect(card.faceUp).toBe(false)
    expect(card.rotated).toBe(0)
    expect(card.marked).toBe(false)
  })
})

describe("state changers", () => {
  test("flip", () => {
    expect(card.faceUp).toBe(false)
    card.flip()
    expect(card.faceUp).toBe(true)
    card.flip()
    expect(card.faceUp).toBe(false)
  })
  test("show", () => {
    expect(card.faceUp).toBe(false)
    card.show()
    expect(card.faceUp).toBe(true)
    card.show()
    expect(card.faceUp).toBe(true)
  })
  test("hide", () => {
    expect(card.faceUp).toBe(false)
    card.show()
    expect(card.faceUp).toBe(true)
    card.hide()
    expect(card.faceUp).toBe(false)
    card.hide()
    expect(card.faceUp).toBe(false)
  })
})
