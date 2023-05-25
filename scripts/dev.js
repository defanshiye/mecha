'use strict';

const fs = require('fs');
const chalk = require('chalk');
const rimraf = require('rimraf');
const express = require('express');

const choosePort = require('./utils/choosePort');
const clearConsole = require('./utils/clearConsole');

const paths = require('../config/paths');
const readyDevServer = require('./readyDevServer');
const renderSSR = require('../src/server/render');

// check mecha.config.js
if (!fs.existsSync(paths.appConfig)) {
  console.log(
    chalk.bgRed('Error: => '),
    chalk.red('You must have a mecha.config.js in your app root directory.')
  );
  process.exit(1);
}

const { port: defaultPort } = require(paths.appConfig);

const app = express();

choosePort(defaultPort).then(port => {
  rimraf.rimrafSync(paths.appBuild);

  const bundles = {
    bundle: undefined,
    clientManifest: undefined,
  };

  app.use('/', (request, response) => {
    readyDevServer(app, (bundle, clientManifest) => {
      bundles.bundle = bundle;
      bundles.clientManifest = clientManifest;
    }).then(() => {
      const root = renderSSR({
        request,
        response,
        bundles,
      });
      response.send(root);
    });
  });

  app.listen(port, () => {
    console.log(
      chalk.green(`ready     `),
      `- App started on: http://localhost:${port}`
    );
  });
});
