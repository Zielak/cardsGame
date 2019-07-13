import { propsMatch } from "../../../src/conditions/selectors/helpers"
import { ConstructedEntity } from "../../helpers/dumbEntity"
import { State } from "../../../src/state"

let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
})

it("checks for name", () => {
  const entity = new ConstructedEntity({ state })

  expect(propsMatch("name", ["test", "Dummie"])(entity)).toBe(true)
  expect(propsMatch("name", ["whoop"])(entity)).toBe(false)
  expect(propsMatch("name", [])(entity)).toBe(false)
})
