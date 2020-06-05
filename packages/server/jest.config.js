module.exports = {
  displayName: "Server",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/test/tsconfig.json",
      diagnostics: true,
    },
  },
}
