const detect = require('detect-port');
const chalk = require('chalk');

module.exports = defaultPort => {
  return detect(defaultPort).then(
    port => {
      if (port !== defaultPort) {
        console.log(
          chalk.blue(`Something is already running on ${defaultPort}.`)
        );
        console.log(chalk.blue('Checking another port instead......\n'));
      }
      return port;
    },
    err => {
      throw new Error(
        chalk.red(`Could not find an open port at ${chalk.bold(host)}.`) +
          '\n' +
          ('Network error message: ' + err.message || err) +
          '\n'
      );
    }
  );
};
