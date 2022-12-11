/** @type {import('jest').Config} */
const config = {
  rootDir: "../",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/__*__/**"],
  projects: ["<rootDir>/packages/*/jest.config.cjs"],
}

module.exports = config
