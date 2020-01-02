const path = require("path")
const { SourceMapDevToolPlugin } = require("webpack")
const DeclarationBundler = require("webpack-plugin-typescript-declaration-bundler")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

const getPlugins = env => {
  const plugins = [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false
    })
  ]
  plugins.push(
    new SourceMapDevToolPlugin({
      filename: "[file].map",
      append: "\n//# sourceMappingURL=[url]"
    })
  )

  return plugins
}

module.exports = env => {
  if (env === undefined) {
    env = { development: true }
  }
  console.log("env:", env)
  return {
    entry: {
      index: "./src/index.ts"
    },
    output: {
      filename: "[name].js",
      chunkFilename: "cardsGame.[name].js",
      path: path.resolve(__dirname, "lib"),
      library: "cardsgameClient",
      libraryTarget: "umd"
    },
    mode: env && env.development ? "development" : "production",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    // optimization: {
    //   splitChunks: {
    //     chunks: "all"
    //   }
    // },
    plugins: getPlugins(env),
    resolve: {
      extensions: [".ts", ".js"]
    }
  }
}
