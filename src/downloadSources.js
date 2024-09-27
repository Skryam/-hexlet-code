import fs from 'node:fs/promises';
import Listr from 'listr';
import axios, { AxiosError } from 'axios';
import path from 'node:path';
import * as cheerio from 'cheerio';
import generateName from './generateName.js';

const map = {
  link: 'href',
  img: 'src',
  script: 'src',
};

export default ($, takeURL, pathToFiles, filesName) => {
  const promises = $('link, img, script').map((index, item) => {
    const tag = map[item.name];
    const $item = $(item);
    const link = $item.attr(tag);
    return new Listr([
      {
        title: `download resource: ${link}`,
        task: (ctx, task) => {
          if (!link) return;
          const check = new URL(link, takeURL.href);
          if (check.host !== takeURL.host) return;

          const saveFilePath = path.join(pathToFiles, generateName(check));
          const fileName = path.join(filesName, generateName(check));

          axios.get(check.href, { responseType: 'stream' })
            .then((response) => {
              fs.writeFile(saveFilePath, response.data);
            })
            .catch((e) => {
              task.skip('poh');
            });
          // изменение ссылок в разметке
          $item.attr(tag, fileName);
        },
      },
    ]).run();
  });

  return Promise.all(promises).then(() => $);
};
