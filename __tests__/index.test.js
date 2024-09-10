import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
import path from 'node:path';
import nock from 'nock';
import os from 'node:os';
import { fileURLToPath } from 'url';
import logic from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

const deleteFiles = () => {
  fs.readdir(os.tmpdir())
    .then((files) => files.filter((f) => f.match(/page-loader-.*/)).forEach((del) => fs.rmdir(`${os.tmpdir()}/${del}`, { recursive: true })))
    .catch((e) => console.log(e));
};

/* beforeAll(() => {
  deleteFiles();
}) */

let makeTempDir;
beforeAll(async () => {
  makeTempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('saved image', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, await fs.readFile('./__fixtures__/courses.html'));

  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, await fs.readFile('./__fixtures__/courses.html'));

  nock('https://ru.hexlet.io')
    .get('/assets/professions/nodejs.jpg')
    .reply(200, await fs.readFile('./__fixtures__/nodejs.jpg'));

  nock('https://ru.hexlet.io')
    .get('/assets/application.css')
    .reply(200, await fs.readFile('./__fixtures__/application.css'));

  nock('https://ru.hexlet.io')
    .get('/packs/js/runtime.js')
    .reply(200, await fs.readFile('./__fixtures__/runtime.js'));

  const fun = await logic('https://ru.hexlet.io/courses', makeTempDir);

  const result = cheerio.load(await fs.readFile(fun, 'utf8'))('img').attr('src');

  expect(result.match(/page-loader/)
  && result.match(/ru-hexlet-io-courses_files.ru-hexlet-io-courses.jpg/)).toBeTruthy();

  expect(await fs.readFile(path.join(fun, '..', 'ru-hexlet-io-courses_files', 'ru-hexlet-io-courses.jpg'), 'utf8')).toBe(
    await fs.readFile(getFixturePath('nodejs.jpg'), 'utf8'),
  );
});

test('error 400', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(400);

  await expect(logic('https://ru.hexlet.io/courses', makeTempDir)).rejects.toThrowError();
});

test('error 403', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(403);

  await expect(logic('https://ru.hexlet.io/courses', makeTempDir)).rejects.toThrowError();
});

test('error 502', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(502);

  await expect(logic('https://ru.hexlet.io/courses', makeTempDir)).rejects.toThrowError();
});

test('error 304', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(304);

  await expect(logic('https://ru.hexlet.io/courses', makeTempDir)).rejects.toThrowError();
});

test('ошибочный путь к сохранению', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200);

  await expect(logic('https://ru.hexlet.io/courses', 'error')).rejects.toThrowError();
});