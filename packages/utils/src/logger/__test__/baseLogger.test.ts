import { Logger } from "../baseLogger.js"

let logs: TestLogger

class TestLogger extends Logger {
  constructor() {
    super("", true)
  }
  get __allowedLogs() {
    return this.allowedLogs
  }
}

beforeEach(() => {
  logs = new TestLogger()
})

describe("logLevel", () => {
  describe("allows both entries in array", () => {
    const expected = new Set([
      "verbose",
      "debug",
      "notice",
      "log",
      "info",
      "warn",
      "error",
    ])

    it("when picked first entry", () => {
      logs.logLevel = "verbose"
      expect(new Set(logs.__allowedLogs)).toEqual(expected)
    })

    it("when picked second entry", () => {
      logs.logLevel = "debug"
      expect(new Set(logs.__allowedLogs)).toEqual(expected)
    })
  })

  it("allows only error", () => {
    logs.logLevel = "error"
    expect(logs.__allowedLogs).toEqual(["error"])
  })
})
