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
  let $;

  return axios.get(url)
  .then((response) => {
  $ = cheerio.load(response.data);
  })
  //создание папки для файлов
  .then(() => fs.mkdir(pathToFiles))
  //сохранение пикч
  .then(() => {
    $('img').each((index, img) => {
      axios.get(takeURL.href + $(img).attr("src"), { responseType: 'stream' })
    })
  })
  .then((response) => {
    const savePicPath = path.join(pathToFiles, generateName(link.match(/\.[^.]+$/)));
    $(`img[src=${link}]`).attr('src', savePicPath)
    console.log($.html())
    fs.writeFile(savePicPath, response.data)
  })
  //изменение ссылок в разметке и её сохранение
  .then(() => console.log($.html()))
  //.then(() => fs.writeFile(pathToSaveHTML, $.html())))

  .then(() => {
    return savePath
  })
  .catch((e) => console.log(e))
}