import axios, { AxiosError } from 'axios';
import Listr from 'listr';
import * as cheerio from 'cheerio';
import path from 'node:path';
import fs from 'node:fs/promises';
import generateName from './generateName.js';
import downloadSources from './downloadSources.js';

export default (url, savePath) => {
  const takeURL = new URL(url);

  const baseURLName = generateName(takeURL);
  const pathToSaveHTML = path.join(savePath, baseURLName);
  const filesDirName = baseURLName.replace('.html', '_files');
  const pathToFiles = path.join(savePath, filesDirName);

  return new Listr([
    {
      title: 'download page',
      task: () => fs.mkdir(pathToFiles)
        .then(() => axios.get(url))
        .then((response) => cheerio.load(response.data))
        .then(($) => downloadSources($, takeURL, pathToFiles, filesDirName))
        .then(($) => fs.writeFile(pathToSaveHTML, $.html()))
        .then(() => pathToSaveHTML)
        .catch((e) => {
          if (e instanceof AxiosError) {
            console.error('htpp error');
            throw new Error(e);
          } else if (e.code) {
            console.error('File system error');
            throw new Error(e);
          }
          throw new Error(e);
        }),
    },
  ]).run();
};
