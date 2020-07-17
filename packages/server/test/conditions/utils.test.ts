import { getFlag } from "../../src"
import { ref } from "../../src/conditions/utils"

test("getFlag", () => {
  expect(() => getFlag({}, "subject")).toThrow()
})

test("ref", () => {
  expect(() => ref({}, "subject")).toThrow()
  expect(() => ref({}, "subject", "value")).toThrow()
})
