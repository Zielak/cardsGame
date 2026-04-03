// import baseConfig from "@cardsgame/base-configs"
import { defineConfig } from "tsdown"

export default defineConfig({
  exports: true,
  entry: "./src/index.ts",
  tsconfig: "tsconfig.build.json",
  dts: true,
  format: {
    esm: { target: ["es2015"] },
    cjs: { target: ["node24"] },
  },
  unbundle: true,
})
