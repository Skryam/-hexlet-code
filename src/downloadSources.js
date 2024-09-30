import fs from 'node:fs/promises';
import Listr from 'listr';
import axios, { AxiosError } from 'axios';
import path from 'node:path';
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
        title: `download source: ${link}`,
        task: (ctx, task) => {
          if (!link) return;
          const url = new URL(link, takeURL.href);
          if (url.host !== takeURL.host) return;

          const saveFilePath = path.join(pathToFiles, generateName(url));
          const fileName = `${filesName}/${generateName(url)}`;

          $item.attr(tag, fileName);

          return axios.get(url.href, { responseType: 'stream' })
            .then((response) => fs.writeFile(saveFilePath, response.data))
            .catch((e) => {
              if (e instanceof AxiosError) {
                return task.skip(`Resource ${e.config.url} could not be downloaded at the moment`);
              } throw e;
            });
        },
      },
    ]).run();
  });

  return Promise.all(promises).then(() => $);
};
