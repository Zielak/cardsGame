import { LabeledEntity } from "../../__test__/helpers/labeledEntities.js"
import { State } from "../../state/state.js"
import { Deck } from "../deck.js"

let state: State

beforeEach(() => {
  state = new State()
})

test("updateTopElement", () => {
  const deck = new Deck(state, {})

  new LabeledEntity(state, { parent: deck, name: "first" })
  new LabeledEntity(state, { parent: deck, name: "second" })

  expect(deck.topDeck.name).toBe("second")

  deck.removeChildAt(1)

  expect(deck.topDeck.name).toBe("first")

  deck.removeChildAt(0)

  expect(deck.topDeck.name).toBe(undefined)
})
