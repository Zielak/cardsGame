module.exports = {
  displayName: "utils",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/test/tsconfig.json",
      diagnostics: true,
    },
  },
}
