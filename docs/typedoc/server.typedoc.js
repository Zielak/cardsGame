const { join } = require("path")

const { typedocOptions, ROOT_DIR } = require("./base.typedoc")

module.exports = {
  ...typedocOptions,
  entryPoints: [join(ROOT_DIR, "packages/server/src/index.ts")],
  tsconfig: [join(ROOT_DIR, "packages/server/src/tsconfig.json")],
  out: join(ROOT_DIR, "/docs/docs/api/server"),
}
