const base = require("@cardsgame/base-configs/jest.config.cjs")

module.exports = {
  ...base,
  displayName: "server-testing",
  setupFiles: ["./testSetup.ts"],
}
