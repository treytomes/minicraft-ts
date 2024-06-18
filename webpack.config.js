const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const common_config = {
  node: {
    __dirname: true,
  },
  mode: process.env.ENV || 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
      path: path.resolve(__dirname, 'dist/server'),
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
      path: path.resolve(__dirname, 'dist/preload'),
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
      path: path.resolve(__dirname, 'dist/client'),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {from: './client/assets/favicon.ico', to: 'favicon.ico'},
          {from: './client/public/index.html', to: 'index.html'},
          {from: './client/public/index.css', to: 'index.css'},
          {from: './client/public/canvas.fs', to: 'canvas.fs'},
          {from: './client/public/canvas.vs', to: 'canvas.vs'},
          {context: './client/', from: './assets/*.wav', to: '.'},
          {context: './client/', from: './assets/*.png', to: '.'},
        ],
      }),
    ],
  }),
];
