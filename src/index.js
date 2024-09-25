import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import path from 'node:path';
import fs from 'node:fs/promises';
import generateName from './generateName.js';
import downloadSources from './downloadSources.js';

export default (url, savePath) => {
  const takeURL = new URL(url);

  const baseURLName = generateName(takeURL);
  const pathToSaveHTML = path.join(savePath, baseURLName);
  const pathToFiles = path.join(savePath, baseURLName.replace('.html', '_files'));

  // создание папки для файлов
  return fs.mkdir(pathToFiles)
    .then(() => axios.get(url))
    .then((response) => cheerio.load(response.data))
  // сохранение файлов
    .then(($) => downloadSources($, takeURL, pathToFiles))
  // сохранение разметки
    .then(($) => fs.writeFile(pathToSaveHTML, $.html()))
    .then(() => {
      console.log(pathToSaveHTML);
      return pathToSaveHTML;
    })
    /*.catch((e) => {
      if (e instanceof AxiosError) {
        console.error('ИНЕТ БЛЯ НЕ ГРУЗИТ ААААА');
        throw new Error(e);
      }
      console.error('НИХУЯ НЕ РАБОТАЕТ');
      throw new Error(e);
    }); */
};
