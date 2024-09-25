import fs from 'node:fs/promises';
import Listr from 'listr';
import axios from 'axios';
import path from 'node:path';
import * as cheerio from 'cheerio';
import generateName from './generateName.js';

export default ($, takeURL, pathToFiles) => {
  const promises = $('link, img, script').map((index, item) => {
    const $item = $(item);
    const link = $(item).attr('href') || $(item).attr('src');
    new Listr([
      {
        title: `check for local resourse: ${link}`,
        task: () => {
          if (link === undefined) return;
          const check = new URL(link, takeURL.href);
          if (check.host !== takeURL.host) return;

          const savePicPath = path.join(pathToFiles, generateName(check));

          axios.get(check.href, { responseType: 'stream' })
            .then((response) => {
              fs.writeFile(savePicPath, response.data);
            });
          // изменение ссылок в разметке
          if ($item.attr('href')) {
            $item.attr('href', savePicPath);
          } else if ($item.attr('src')) {
            $item.attr('src', savePicPath);
          }
        },
      },
    ], { concurrent: true }).run();
  });

  return Promise.all(promises).then(() => $);
};
