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
          const fileName = `${filesName}/${generateName(check)}`;

          $item.attr(tag, fileName);

          return axios.get(check.href, { responseType: 'stream' })
            .then((response) => {
              return fs.writeFile(saveFilePath, response.data);
            })
            .catch((e) => {
              if (e instanceof AxiosError && e.status === 404) {
                task.skip(`Resource ${e.config.url} not found!`);
              }
            });
          // изменение ссылок в разметке
          
        },
      },
    ]).run();
  });

  return Promise.all(promises).then(() => $);
};
