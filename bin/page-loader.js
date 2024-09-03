#!/usr/bin/env node
import { program } from 'commander';
import logic from '../src/index.js';
import debug from 'debug';
import axiosDebug from 'axios-debug-log';
const pageLoaderDebug = debug('page-loader');
pageLoaderDebug('enabled');

require('axios-debug-log');

program
  .version('1.0.0', '-V, --version', 'output the version number')
  .arguments('<url>')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir', '/home/user/current-dir')
  .action((url, options) => logic(url, options.output));

program.parse(process.argv);
axiosDebug('page-lodaer')
