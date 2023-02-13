import type { ServerPlayerMessage, State } from "@cardsgame/server"
import { ClassicCard } from "@cardsgame/server/entities"

import { initState } from "../initState.js"
import {
  makeInteraction,
  MakeInteraction,
  makeInteractionSetup,
} from "../makeInteraction.js"

let state: State
let makeInteractionInner: MakeInteraction
let events: ServerPlayerMessage[]

beforeAll(() => {
  makeInteractionInner = makeInteractionSetup(() => state)
})

describe("no state", () => {
  it("throws error when no state is available", () => {
    state = undefined
    expect(() => makeInteraction(state, {})).toThrow("state is undefined")
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

  describe("interaction", () => {
    it("passes interaction type", () => {
      expect(
        makeInteraction(state, { name: "S6" }, "dragstart").interaction
      ).toBe("dragstart")
    })
    it("sets default to tap", () => {
      expect(makeInteraction(state, { name: "S6" }).interaction).toBe("tap")
    })
  })
})
