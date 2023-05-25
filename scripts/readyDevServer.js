'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const MFS = require('memory-fs');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const clientConfig = require('../config/client.config');
const serverConfig = require('../config/server.config');

const readFile = (_fs, _fileName, isServer) =>
  _fs.readFileSync(
    path.join(
      isServer ? serverConfig.output.path : clientConfig.output.path,
      _fileName
    ),
    'utf-8'
  );

module.exports = (app, callback) => {
  console.log(chalk.cyan('...wait   '), 'ready dev server...');

  let bundle;
  let clientManifest;
  let resolve;

  const readyPromise = new Promise(r => {
    resolve = r;
  });
  const updateBundles = () => {
    if (bundle && clientManifest) {
      callback(bundle, clientManifest);
      resolve();
    }
  };

  const absClientConfig = {
    ...clientConfig,
    entry: ['webpack-hot-middleware/client', clientConfig.entry],
  };

  console.log(chalk.cyan('...wait   '), 'start compile client...');

  const clientCompiler = webpack(absClientConfig);
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    serverSideRender: true,
  });

  app.use(devMiddleware);

  app.use(webpackHotMiddleware(clientCompiler));

  clientCompiler.hooks.done.tap('done', stats => {
    const info = stats.toJson();
    if (stats.hasWarnings()) {
      console.warn(chalk.yellow(info.warnings));
    }
    if (stats.hasErrors()) {
      console.error(chalk.red(info.errors));
      return;
    }

    clientManifest = readFile(
      devMiddleware.context.outputFileSystem,
      'client-manifest.json'
    );

    updateBundles();
    // console.log(clientManifest, 'clientManifest');
  });

  const serverCompiler = webpack(serverConfig);

  // 使用内存文件系统
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    const info = stats.toJson();
    if (stats.hasWarnings()) {
      console.warn(chalk.yellow(info.warnings));
    }
    if (stats.hasErrors()) {
      console.error(chalk.red(info.errors));
      return;
    }

    bundle = JSON.parse(readFile(mfs, 'server-bundle.json', true));
    updateBundles();
  });

  return readyPromise;
};
