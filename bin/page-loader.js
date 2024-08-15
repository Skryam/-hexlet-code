#!/usr/bin/env node
import { program } from 'commander';
import logic from '../src/index.js';

program
.version('1.0.0', '-V, --version', 'output the version number')
.arguments('<url>')
.description('Page loader utility')
.option('-o, --output [dir]', 'output dir', '/home/user/current-dir')
.action((url, options) => logic(url, options))

program.parse(process.argv);