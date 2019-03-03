// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "test/tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js"],
  // moduleDirectories: ["node_modules", "src"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
}
