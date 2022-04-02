import { Bot, isBot, Player } from "src/player"

test("isBot", () => {
  expect(isBot({})).toBeFalsy()
  expect(isBot(new Player({ clientID: "test" }))).toBeFalsy()
  expect(isBot("bot")).toBeFalsy()

  expect(isBot(new Bot({ clientID: "test" }))).toBeTruthy()
})
