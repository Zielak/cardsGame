import { setupServerTesting } from "../setup"

import { ActionPickCard } from "./helpers"

it("returns API", () => {
  const api = setupServerTesting({ action: ActionPickCard })

  expect(typeof api).toBe("object")
})
