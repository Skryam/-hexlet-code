import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'node:path';
import fs from 'node:fs/promises';
import { cwd } from 'node:process';
import Listr from 'listr';

export default (url, toSavePath) => {
  const savePath = toSavePath === '/home/user/current-dir' ? cwd() : toSavePath;
  const takeURL = new URL(url);

  const generateName = (src = url) => {
    const extension = path.extname(src) ? path.extname(src) : '.html'
    const sliceExtension = src.replace(extension, '');

    return `${takeURL.hostname}${takeURL.pathname}`.split('')
    .map((elem) => {
      if (/[a-zA-Z0-9]/.test(elem)) return elem;
      return '-';
    }).join('').concat(extension);
  }

  const baseURLName = generateName();
  const pathToSaveHTML = path.join(savePath, baseURLName);
  const pathToFiles = path.join(savePath, baseURLName.replace('.html', '_files'));

  // создание папки для файлов
  return fs.mkdir(pathToFiles)
    .then(() => axios.get(url))
    .then((response) => cheerio.load(response.data))
    .then(($) => {
    // ресурсы
      const promises = [
        ['link', 'href'],
        ['img', 'src'],
        ['script', 'src'],
      ].map(([tag, src]) => $(tag).map((index, item) => {
        new Listr([
        {
          title: `check for local resourse: ${$(item).attr(src)}`,
          task: () => {
        const source = $(item).attr(src);
        if (source === undefined) return;
        const check = new URL(source, takeURL.href);
        if (check.host !== takeURL.host) return;

        const savePicPath = path.join(pathToFiles, generateName(source));

        axios.get(check.href, { responseType: 'stream' })
          .then((response) => {
            fs.writeFile(savePicPath, response.data)
          });
        // изменение ссылок в разметке
        $(`${tag}[${src}=${source}]`).attr(src, savePicPath);
          }
        }
      ], { concurrent: true }).run()
      }));
      
      return Promise.all(promises).then(() => $);
    })
  // сохранение разметки
  
    .then(($) => {
      return fs.writeFile(pathToSaveHTML, $.html())
    })
    .then(() => {
      return pathToSaveHTML;
    })
    .catch((e) => {
      console.error(`Выполнение программы завершилось по ошибке:\n${e}`);
      throw new Error(e)
    });
};
