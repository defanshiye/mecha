'use strict';

const paths = require('./paths');

module.exports = {
  mode: 'development',
  entry: paths.appClientEntry,
  output: {
    path: `${paths.appBuild}/client`,
    filename: 'client.bundle.js',
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
};
