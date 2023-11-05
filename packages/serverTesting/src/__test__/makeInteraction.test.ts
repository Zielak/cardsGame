import { type ServerPlayerMessage, State } from "@cardsgame/server"
import { ClassicCard } from "@cardsgame/server/entities"

import {
  makeInteraction,
  MakeInteraction,
  makeInteractionSetup,
} from "../makeInteraction.js"
import { PopulateState, populateStateSetup } from "../populateState.js"

let state: State
let makeInteractionInner: MakeInteraction
let events: ServerPlayerMessage[]
const stateGetter = (): State => state

beforeAll(() => {
  state = new State()
  makeInteractionInner = makeInteractionSetup(stateGetter)

  const populateStateInner = populateStateSetup(stateGetter)
  populateStateInner([
    null,
    {
      children: [{ type: "classicCard", name: "S6" }],
    },
  ])
})

describe("no state", () => {
  it("throws error when no state is available", () => {
    expect(() => makeInteraction(undefined, {})).toThrow("state is undefined")
  })
})

describe("state", () => {
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

  describe("interaction", () => {
    it("passes interaction type", () => {
      expect(
        makeInteraction(state, { name: "S6" }, "dragstart").interaction,
      ).toBe("dragstart")
    })
    it("sets default to tap", () => {
      expect(makeInteraction(state, { name: "S6" }).interaction).toBe("tap")
    })
  })
})
