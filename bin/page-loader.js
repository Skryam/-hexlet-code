#!/usr/bin/env node
import { cwd } from 'node:process';
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
      const pathToSave = options.output === '/home/user/current-dir' ? cwd() : options.output;
      logic(url, pathToSave);
    } catch (e) {
      process.exit(1);
    }
  });

program.parse(process.argv);
