import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import copy from "rollup-plugin-copy"
// import postcss from "rollup-plugin-postcss"
import svelte from "rollup-plugin-svelte"
import sveltePreprocess from "svelte-preprocess"

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
  strictDeprecations: true,
}

export default config
