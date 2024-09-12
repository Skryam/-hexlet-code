#!/usr/bin/env node
import { program } from 'commander';
import axiosDebug from 'axios-debug-log';
import logic from '../src/index.js';
import 'axios-debug-log/enable.js';
// Log content type
axiosDebug({
  request(debug, config) {
    debug(`Request with ${config.headers['content-type']}`);
  },
  response(debug, response) {
    debug(
      `Response with ${response.headers['content-type']}`,
      `from ${response.config.url}`,
    );
  },
  error(debug, error) {
    debug('Boom', error);
  },
});

program
  .version('1.0.0', '-V, --version', 'output the version number')
  .arguments('<url>')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir', '/home/user/current-dir')
  .action((url, options) => {
    try {
      logic(url, options.output);
    } catch (e) {
      console.error(`Выполнение программы завершилось по ошибке: ${e.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
