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
    }).join('').concat(format ?? '.html');

  const pathToSaveHTML = path.join(savePath, generateName('.html'));
  const pathToFiles = path.join(savePath, generateName('_files'));

  //создание папки для файлов
  return fs.mkdir(pathToFiles)
  .then(() => axios.get(url))
  .then((response) => cheerio.load(response.data))
  .then(($) => {
    //пикчи
    const promises = [
      ["link", "href"],
      ["img", "src"],
      ["script", "src"],
    ].map(([tag, src]) => {
      return $(tag).map((index, item) => {
        const source = $(item).attr(src);
        const check = new URL(source, takeURL.href);
        if (check.host !== takeURL.host) return;
        else {
          const savePicPath = path.join(pathToFiles, generateName(source.match(/\.[^.]+$/)));
          const getFile = axios.get(check.href, { responseType: 'stream' })
          .then((response) => {
            return fs.writeFile(savePicPath, response.data)
          })
        $(`${tag}[${src}=${source}]`).attr(src, savePicPath)
      }
      })
    })
    return Promise.all(promises).then(() => $)
  })
  //изменение ссылок в разметке и её сохранение
  .then(($) => fs.writeFile(pathToSaveHTML, $.html()))

  .then(() => {
    console.log(pathToSaveHTML)
    return pathToSaveHTML
  })
  .catch((e) => console.log(e))
}