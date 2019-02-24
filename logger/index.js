const t1 = Date.now();
const fs = require("fs-extra");
const path = require("path");

const logs = path.join(__dirname, 'log.txt');
const errLogs = path.join(__dirname, 'log.err.txt');

const logger = fs.createWriteStream(logs, {
  flags: 'a'
});

const errLogger = fs.createWriteStream(errLogs, {
  flags: 'a'
});

module.exports = {
  logger,
  errLogger
};