#!/usr/bin/env node
import { program } from 'commander';
import logic from '../src/index.js';
import axiosDebug from 'axios-debug-log'
import 'axios-debug-log/enable.js'
// Log content type
axiosDebug({
  request: function (debug, config) {
    debug('Request with ' + config.headers['content-type'])
  },
  response: function (debug, response) {
    debug(
      'Response with ' + response.headers['content-type'],
      'from ' + response.config.url
    )
  },
  error: function (debug, error) {
    debug('Boom', error)
  }
})

program
  .version('1.0.0', '-V, --version', 'output the version number')
  .arguments('<url>')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir', '/home/user/current-dir')
  .action((url, options) => logic(url, options.output));

program.parse(process.argv);
