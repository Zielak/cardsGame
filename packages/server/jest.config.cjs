const base = require("@cardsgame/base-configs/jest.config.cjs")
const { pathsToModuleNameMapper } = require("ts-jest")

const { compilerOptions } = require("./tsconfig.json")

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...base,
  displayName: "server",
  setupFiles: ["./testSetup.ts"],
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  // modulePaths: [`<rootDir>/packages/server/${compilerOptions.baseUrl}`],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    // prefix: "<rootDir>/src/",
    useESM: true,
  }),
}
