import { Conditions } from "../src/conditions"
import { State } from "../src/state"
import { ServerPlayerEvent, Player } from "../src/player"
import { ConstructedEntity } from "./helpers/dumbEntity"
import { ConstructedParent } from "./helpers/dumbParent"

let state: State
let event: ServerPlayerEvent
let parent: ConstructedParent
let child: ConstructedEntity
let con: Conditions<State>

beforeEach(() => {
  state = new State()
  event = {
    player: new Player({ clientID: "123", state }),
    entity: new ConstructedEntity({ state })
  }
  parent = new ConstructedParent({ state, name: "parent" })
  child = new ConstructedEntity({ state, parent, name: "child" })

  con = new Conditions<State>(state, event)
})

// describe('chainers')

describe("constructor", () => {
  it("defines all props", () => {
    expect(con._state).toBe(state)
    expect(con._event).toBe(event)
    expect(con._subject).toBe(state)
  })
})

describe("references/aliases", () => {
  test("parent", () => {
    expect(con._refs.size).toBe(0)
    con.get({ name: "parent" }).as("parent")

    expect(con._refs.size).toBe(1)
    expect(con._refs.has("parent")).toBeTruthy()
    expect(con._refs.get("parent")).toBe(parent)

    expect(con._subject).toBe(state)
    con.get("parent")
    expect(con._subject).toBe(parent)
  })
})

describe("subject changing", () => {
  test("entity", () => {
    expect(con._subject).toBe(state)
    con.entity
    expect(con._subject).toBe(event.entity)
  })

  test("children", () => {
    expect(con._subject).toBe(state)
    con.get({ name: "parent" }).as("parent")
    con.get("parent").children

    expect(Array.isArray(con._subject)).toBeTruthy()
    expect(con._subject.length).toBe(1)
    expect(con._subject).toContain(child)

    expect(() => con.get("parent").children.to.be.empty).toThrow()
    expect(() => con.get("parent").children.not.empty).not.toThrow()
  })
})
