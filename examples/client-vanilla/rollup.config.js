import commonjs from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "main.mjs",
  output: {
    format: "es",
    file: "index.mjs",
  },
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
  ],
}

export default config
