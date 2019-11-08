import { Container, Deck, Hand, Line, Pile, Row } from "../../src/entities"
import { State } from "../../src/state"

let state: State

beforeEach(() => {
  state = new State({
    hostID: "asd"
  })
})

test("All constructors", () => {
  expect(() => new Container(state)).not.toThrow()
  expect(() => new Deck(state)).not.toThrow()
  expect(() => new Hand(state)).not.toThrow()
  expect(() => new Line(state)).not.toThrow()
  expect(() => new Pile(state)).not.toThrow()
  expect(() => new Row(state)).not.toThrow()
})
