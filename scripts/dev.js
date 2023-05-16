'use strict';

const chalk = require('chalk');
const server = require('./server');
const clearConsole = require('./utils/clearConsole');
const choosePort = require('./utils/choosePort');

const defaultPort = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

clearConsole();

choosePort(defaultPort)
  .then(port => {
    server.listen(port, () => {
      console.log(chalk.green(`✅ App started on: http://localhost:${port}`));
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
