'use strict';

const fs = require('fs');
const chalk = require('chalk');
const rimraf = require('rimraf');
const webpack = require('webpack');

const paths = require('../config/paths');
const choosePort = require('./utils/choosePort');
const clearConsole = require('./utils/clearConsole');
const serverConfig = require('../config/server.config');

// check mecha.config.js
if (!fs.existsSync(paths.appConfig)) {
  console.log(
    chalk.bgRed('Error: => '),
    chalk.red('You must have a mecha.config.js in your app root directory.')
  );
  process.exit(1);
}

const { port: defaultPort } = require(paths.appConfig);

choosePort(defaultPort).then(port => {
  rimraf.rimrafSync(paths.appBuild);

  const compiler = webpack(serverConfig);
  compiler.run((err, stats) => {
    // 编译完成后的回调函数
    if (err) {
      console.error(err);
    } else {
      const server = require('../.mecha/server/server.entry').response.app;
      server.listen(port, () => {
        console.log(
          chalk.green(`ready`),
          `- App started on: http://localhost:${port}`
        );
      });
    }
  });
});
