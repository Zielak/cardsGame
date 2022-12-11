module.exports = {
  preset: "ts-jest",
  // preset: "ts-jest/presets/js-with-babel-esm",
  testMatch: [
    "**/__test__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  transformIgnorePatterns: ["node_modules/(?!(@cardsgame)/)"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
}
