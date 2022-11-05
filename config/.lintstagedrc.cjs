module.exports = {
  "*.{js,jsx,cjs,ts,tsx,json,html,scss,md}": "prettier --write",
  "*.{js,jsx,cjs,ts,tsx}":
    "eslint --cache --cache-location node_modules/.eslintcache --fix",
  ".circleci/config.yml": "circleci config validate",
  "**/*.{tf,tfvars,tfbackend}": (filenames) =>
    filenames.map((filename) => `terraform fmt -write '${filename}'`),
}
