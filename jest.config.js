module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["packages/**/*.{ts}", "!**/node_modules/**"],
  projects: ["<rootDir>/packages/*"]
}
