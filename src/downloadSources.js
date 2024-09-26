import fs from 'node:fs/promises';
import Listr from 'listr';
import axios from 'axios';
import path from 'node:path';
import * as cheerio from 'cheerio';
import generateName from './generateName.js';

export default ($, takeURL, pathToFiles, filesName) => {
  const promises = $('link, img, script').map((index, item) => {
    const $item = $(item);
    const link = $(item).attr('href') || $(item).attr('src');
    new Listr([
      {
        title: `download re: ${link}`,
        task: () => {
          if (!link) return;
          const check = new URL(link, takeURL.href);
          if (check.host !== takeURL.host) return;

          const saveFilePath = path.join(pathToFiles, generateName(check));
          const fileName = path.join(filesName, generateName(check));

          axios.get(check.href, { responseType: 'stream' })
            .then((response) => {
              fs.writeFile(saveFilePath, response.data);
            });
          // изменение ссылок в разметке
          if ($item.attr('href')) {
            $item.attr('href', fileName);
          } else if ($item.attr('src')) {
            $item.attr('src', fileName);
          }
        },
      },
    ]).run();
  });

  return Promise.all(promises).then(() => $);
};
