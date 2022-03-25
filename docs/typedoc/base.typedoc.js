const { resolve } = require("path")

const packagesToDocs = ["server", "client", "utils", "serverTesting"]

const ROOT_DIR = resolve(__dirname, "../..")

const typedocOptions = {
  githubPages: false,
  preserveWatchOutput: true,

  // TSDoc
  disableSources: true,
  cleanOutputDir: false,

  excludeExternals: true,
  excludePrivate: true,

  // Markdown
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  hidePageTitle: true,
}

module.exports = {
  ROOT_DIR,
  packagesToDocs,
  typedocOptions,
}
