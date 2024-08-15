import axios from 'axios';
import path from 'node:path';
import fs from 'node:fs/promises'
import { cwd } from 'node:process';

export default (url, toSavePath) => {
  const savePath = toSavePath === '/home/user/current-dir' ? cwd() : toSavePath;
  const takeURL = new URL(url);
  const fileNameToSave = 
  `${takeURL.hostname}${takeURL.pathname}`.split('')
    .map((elem) => {
      if (/[a-zA-Z0-9]/.test(elem)) return elem;
      else return "-";
    }).join('').concat('.html');

  console.log(savePath, '&&', fileNameToSave)
  const pathToSave = path.join(savePath, fileNameToSave);

  return axios.get(url)
  .then((urlData) => fs.writeFile(pathToSave, urlData.data))
  .then(() => pathToSave)
  .catch((e) => console.log(e))
}