'use strict';

const nodeExternals = require('webpack-node-externals');
const paths = require('./paths');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: paths.appServerEntry,
  output: {
    path: paths.appBuild,
    filename: 'server.bundle.js',
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
};
