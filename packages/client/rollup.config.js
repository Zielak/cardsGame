import commonjs from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"

const PRODUCTION = process.env.NODE_ENV === "production"

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/index.ts",
  output: {
    format: "es",
    name: "cardsgameClient",
    file: "dist/index.mjs",
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    PRODUCTION && terser(),
    typescript({
      sourceMap: true,
      inlineSources: false,
      inlineSourceMap: false,
      declaration: false,
      tsconfig: "src/tsconfig.mjs.json",
      exclude: ["**/test", "**/*.test.ts"],
    }),
  ],
  watch: {
    clearScreen: false,
  },
}

export default config
