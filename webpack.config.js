const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log(__dirname);
let common_config = {
  node: {
    __dirname: true
  },
  mode: process.env.ENV || 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
};

module.exports = [
  Object.assign({}, common_config, {
    name: 'server',
    devtool: false,
    target: 'electron-main',
    entry: {
      server: './server/app.ts',
    },
    output: {
      filename: '[name]-bundle.js',
      path: path.resolve(__dirname, 'dist/server')
    },
  }),
  Object.assign({}, common_config, {
    devtool: false,
    target: 'electron-preload',
    entry: {
      server: './preload/index.ts',
    },
    output: {
      filename: 'preload-bundle.js',
      path: path.resolve(__dirname, 'dist/preload')
    },
  }),
  Object.assign({}, common_config, {
    name: 'client',
    devtool: false,
    target: 'electron-renderer',
    entry: {
      client: './client/index.ts',
    },
    output: {
      filename: '[name]-bundle.js',
      path: path.resolve(__dirname, 'dist/client')
    },
    plugins: [
      // TODO: client web assets need to be copied to dist/client.
      new CopyPlugin({
        patterns: [
          { from: "./client/assets/favicon.ico", to: "favicon.ico" },
          { from: "./client/public/index.html", to: "index.html" },
          { from: "./client/public/index.css", to: "index.css" },
        ],
      }),
      // new HtmlWebpackPlugin({
      //   // ...
      //   csp: {
      //     'script-src': ["'self'"],
      //   },
      // }),
    ],
  })
]