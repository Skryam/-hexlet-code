import path from 'node:path';

export default (url) => {
  const format = path.extname(url.href);
  const extension = format || '.html';

  return `${url.hostname}${url.pathname}`
    .replace(format, '')
    .replaceAll(/\W/gi, '-')
    .concat(extension);
};
