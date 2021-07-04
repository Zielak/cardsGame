module.exports = {
  displayName: "Client",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/test/tsconfig.json",
      diagnostics: true,
    },
  },
}
