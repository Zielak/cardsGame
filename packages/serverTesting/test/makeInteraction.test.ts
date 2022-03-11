import { type ServerPlayerMessage, State, ClassicCard } from "@cardsgame/server"
import { initState } from "src/initState"
import {
  makeInteraction,
  MakeInteraction,
  makeInteractionSetup,
} from "src/makeInteraction"

let state: State
let makeInteractionInner: MakeInteraction
let events: ServerPlayerMessage[]

beforeAll(() => {
  makeInteractionInner = makeInteractionSetup(() => state)
})

describe("no state", () => {
  it("throws error when no state is available", () => {
    state = undefined
    expect(() => makeInteraction(state, {})).toThrowError("state is undefined")
  })
})

describe("state", () => {
  beforeEach(() => {
    state = initState({
      children: [{ type: "classicCard", name: "S6" }],
    })
  })

  it("properly marks an entity to be interacted", () => {
    events = [
      makeInteractionInner({ name: "S6" }),
      makeInteraction(state, { name: "S6" }),
    ]

    events.forEach((event) => {
      expect(event.entity instanceof ClassicCard).toBeTruthy()
      expect(event.entity["name"]).toBe("S6")
    })
  })

  it("provides empty event for unknown entity query", () => {
    events = [
      makeInteractionInner({ name: "nope" }),
      makeInteraction(state, { name: "nope" }),
    ]

    events.forEach((event) => {
      expect(event.entity instanceof ClassicCard).toBeFalsy()
      expect(event.entity).toBeUndefined()
    })
  })
})
