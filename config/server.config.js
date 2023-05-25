'use strict';

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const SSRServerPlugin = require('../plugin/webpack/server-plugin');
const paths = require('./paths');
const util = require('./util');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: paths.appServerEntry,
  output: {
    path: `${paths.appBuild}/server`,
    filename: 'server.entry.js',
    library: {
      type: 'commonjs2',
    },
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
    // ...util.styleLoaders({
    //   sourceMap: true,
    //   usePostCSS: true,
    //   extract: true,
    // }),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_ENV': JSON.stringify('server'), // 指定React环境为服务端
    }),
    new SSRServerPlugin({
      filename: 'server-bundle.json',
    }),
  ],
};
