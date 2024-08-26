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

  //создание папки для файлов
  return fs.mkdir(pathToFiles)
  .then(() => axios.get(url))
  .then((response) => cheerio.load(response.data))
  .then(($) => {
    //пикчи
    const promisesImg = $('img').map((index, img) => {
      const source = $(img).attr("src");
      return axios.get(takeURL.href + source, { responseType: 'stream' })
      .then((response) => {
        const savePicPath = path.join(pathToFiles, generateName(source.match(/\.[^.]+$/)));
        $(`img[src=${source}]`).attr('src', savePicPath)
        return fs.writeFile(savePicPath, response.data)
      })
    })
    const promisesLink = $('link').map((index, link) => {
      const source = $(link).attr('src');
      return axios.get(takeURL.href + source, { responseType: 'stream' })
      .then((response) => {
      })
    })

    return Promise.all(promisesImg).then(() => $)
  })
  //изменение ссылок в разметке и её сохранение
  .then(($) => fs.writeFile(pathToSaveHTML, $.html()))

  .then(() => {
    console.log(pathToSaveHTML)
    return pathToSaveHTML
  })
  .catch((e) => console.log(e))
}