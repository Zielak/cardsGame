const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = env => {
  if (env === undefined) {
    env = { development: true }
  }
  return {
    context: path.join(__dirname, "client"),
    entry: "./app.tsx",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist")
    },
    mode: env && env.development ? "development" : "production",
    devtool: "inline-source-map",
    devServer: {
      host: "0.0.0.0",
      port: 1234
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules\/(?!colyseus\.js)/
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            },
            {
              loader: "sass-loader"
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "index.html"
      })
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    }
  }
}
