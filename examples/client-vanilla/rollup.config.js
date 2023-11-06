import commonjs from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "main.mjs",
  output: {
    format: "es",
    file: "dist/index.mjs",
  },
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
  ],
}

export default config
