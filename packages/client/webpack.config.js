const path = require("path")
const DeclarationBundler = require("webpack-plugin-typescript-declaration-bundler")

module.exports = env => {
  if (env === undefined) {
    env = { development: true }
  }
  return {
    entry: "./src/index.ts",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "lib"),
      library: "cardsgameClient",
      libraryTarget: "umd"
    },
    mode: env && env.development ? "development" : "production",
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new DeclarationBundler({
        moduleName: "@cardsgame/client",
        out: "index.d.ts"
      })
    ],
    resolve: {
      extensions: [".ts", ".js"]
    }
  }
}
