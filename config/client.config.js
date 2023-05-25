'use strict';

const webpack = require('webpack');
const LoadablePlugin = require('@loadable/webpack-plugin');
const paths = require('./paths');

module.exports = {
  mode: 'development',
  entry: paths.appClientEntry,
  output: {
    path: `${paths.appBuild}/client`,
    filename: '[name].[hash].js',
  },
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new LoadablePlugin({
      filename: 'client-manifest.json',
    }),
  ],
};
