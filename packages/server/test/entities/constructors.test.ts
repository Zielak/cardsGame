import { Deck, Grid, Hand, Line, Pile, Spread } from "../../src/entities"
import { Container } from "../../src/entities/container"
import { State } from "../../src/state"

let state: State

beforeEach(() => {
  state = new State()
})

test("All constructors", () => {
  expect(() => new Container(state)).not.toThrow()
  expect(() => new Deck(state)).not.toThrow()
  expect(() => new Grid(state)).not.toThrow()
  expect(() => new Hand(state)).not.toThrow()
  expect(() => new Line(state)).not.toThrow()
  expect(() => new Pile(state)).not.toThrow()
  expect(() => new Spread(state)).not.toThrow()
})
