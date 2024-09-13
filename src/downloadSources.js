import Listr from 'listr';
import axios from 'axios';
import path from 'node:path';
import * as cheerio from 'cheerio';

export default ($, takeURL) => {
  const promises = $('link, img, script').map((index, link) => {
    new Listr([
      {
        title: `check for local resourse: ${link}`,
        task: () => {
          if (link === undefined) return;
          const check = new URL(link, takeURL.href);
          if (check.host !== takeURL.host) return;

          const savePicPath = path.join(pathToFiles, generateName(link));

          axios.get(check.href, { responseType: 'stream' })
            .then((response) => {
              fs.writeFile(savePicPath, response.data);
            });
          // изменение ссылок в разметке
          $(`${tag}[${src}=${link}]`).attr(src, savePicPath);
        },
      },
    ], { concurrent: true }).run();
  });

  return Promise.all(promises).then(() => $);
};
