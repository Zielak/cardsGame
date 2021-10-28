const commonjs = require("@rollup/plugin-commonjs")
const { nodeResolve } = require("@rollup/plugin-node-resolve")
const typescript = require("@rollup/plugin-typescript")
const copy = require("rollup-plugin-copy")
const postcss = require("rollup-plugin-postcss")
const svelte = require("rollup-plugin-svelte")
const { terser } = require("rollup-plugin-terser")
const sveltePreprocess = require("svelte-preprocess")

const PRODUCTION = process.env.NODE_ENV === "production"

const config = {
  input: "src/index.ts",
  output: {
    sourcemap: true,
    format: "es",
    name: "client",
    dir: "dist",
  },
  plugins: [
    svelte({
      preprocess: [
        sveltePreprocess({
          sourceMap: !PRODUCTION,
        }),
      ],
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !PRODUCTION,
      },
    }),

    nodeResolve({
      browser: true,
      dedupe: ["svelte"],
    }),

    commonjs(),

    postcss(),

    PRODUCTION && terser(),

    typescript({
      sourceMap: !PRODUCTION,
      inlineSources: !PRODUCTION,
      declaration: !PRODUCTION,
      tsconfig: "src/tsconfig.json",
    }),

    copy({
      targets: [
        { src: "public/index.html", dest: "dist" },
        { src: "public/styles.css", dest: "dist" },
      ],
    }),
  ],
  watch: {
    clearScreen: false,
  },
}

export default config
