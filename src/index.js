import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'node:path';
import fs from 'node:fs/promises'
import { cwd } from 'node:process';
import { createWriteStream } from 'node:fs';

export default (url, toSavePath) => {
  const savePath = toSavePath === '/home/user/current-dir' ? cwd() : toSavePath;
  const takeURL = new URL(url);

  const generateName = (format) => 
  `${takeURL.hostname}${takeURL.pathname}`.split('')
    .map((elem) => {
      if (/[a-zA-Z0-9]/.test(elem)) return elem;
      else return "-";
    }).join('').concat(format);

  const pathToSaveHTML = path.join(savePath, generateName('.html'));
  const pathToFiles = path.join(savePath, generateName('_files'));

  return axios.get(url, { responseType: 'arrayBuffer' })
  .then((urlData) => {
    const $ = cheerio.load(urlData.data);
    console.log($('img').attr('src'))

    //fs.writeFile(pathToSaveHTML, urlData.data)
    //.then(() => fs.mkdir(pathToFiles))
  })

  .then(() => {
    console.log(savePath)
    return savePath
  })
  .catch((e) => console.log(e))
}