const { pathsToModuleNameMapper } = require("ts-jest")

const { compilerOptions } = require("./test/tsconfig.json")

module.exports = {
  displayName: "ServerTesting",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/test/tsconfig.json",
      diagnostics: true,
    },
  },
  setupFiles: ["./testSetup.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/test/",
  }),
}
