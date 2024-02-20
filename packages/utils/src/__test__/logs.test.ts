import { getGlobalLogger } from "../logger/globalLogger.js"
import * as isBrowserModule from "../logger/isBrowser.js"
import { globalIndent } from "../logger/server/global.js"

jest.mock("../logger/isBrowser.js")
jest.mock("../logger/baseLogger.js")

const mockedIsBrowser = (isBrowserModule as jest.Mocked<typeof isBrowserModule>)
  .isBrowser

it("loads browser logger in browser", () => {
  mockedIsBrowser.mockImplementation(() => true)

  expect(() => getGlobalLogger()).toThrow("window is not defined")
})

it("loads server logger in node", () => {
  mockedIsBrowser.mockImplementation(() => false)

  const result = getGlobalLogger()
  result.log("test")

  expect(globalIndent.getIndent).toHaveBeenCalled()
})
