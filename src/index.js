import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'node:path';
import fs from 'node:fs/promises'
import { cwd } from 'node:process';

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

  return axios.get(url)
  .then((urlData) => {
    const $ = cheerio.load(urlData.data);
    const srcLinks = [];
    $('img').each((index, img) => srcLinks.push($(img).attr('src')))

    fs.writeFile(pathToSaveHTML, urlData.data)
    .then(() => fs.mkdir(pathToFiles))
    .then(() => srcLinks.forEach((link) => {
      axios.get(link, { responseType: 'arrayBuffer' })
      .then((data) => data)//fs.writeFile(path.join(pathToFiles, generateName), data))
    }))
  })

  .then(() => {
    console.log(savePath)
    return savePath
  })
  .catch((e) => console.log(e))
}