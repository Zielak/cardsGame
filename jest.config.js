module.exports = {
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/test/**/*.ts",
  ],
  projects: ["<rootDir>/packages/*"],
}
