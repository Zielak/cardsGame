// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/test/tsconfig.json",
      diagnostics: true
    }
  }
  // transform: {
  //   "^.+\\.(ts|tsx)$": "ts-jest"
  // }
}
