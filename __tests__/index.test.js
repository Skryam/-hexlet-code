import fs from 'node:fs/promises';
import path from 'node:path';
import nock from 'nock';
import os from 'node:os';
import { fileURLToPath } from 'url';
import { rmdirSync } from 'node:fs';
import logic from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readFixturePath = async (filename) => await fs.readFile(path.join(__dirname, '..', '__fixtures__', filename), 'utf-8');

nock.disableNetConnect();

let tempDir;
let content;
let imgContent;
let linkContent;
let scriptContent;
beforeAll(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test', 'page-loader-'));
  content = await fs.readFile('./__fixtures__/courses.html');
  imgContent = await fs.readFile('./__fixtures__/nodejs.jpg');
  linkContent = await fs.readFile('./__fixtures__/application.css');
  scriptContent = await fs.readFile('./__fixtures__/runtime.js');
});

const readFile = async (fileName) => await fs.readFile(path.join(tempDir, 'ru-hexlet-io-courses_files', `ru-hexlet-io-${fileName}`), 'utf-8');

describe('Загрузка разметки и файлов', () => {
  test('http', async () => {
    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200, content)
      .get('/courses')
      .reply(200, content)
      .get('/assets/professions/nodejs.jpg')
      .reply(200, imgContent)
      .get('/assets/application.css')
      .reply(200, linkContent)
      .get('/packs/js/runtime.js')
      .reply(200, scriptContent);

    await logic('https://ru.hexlet.io/courses', tempDir);

    expect(await fs.readFile(path.join(tempDir, 'ru-hexlet-io-courses.html'), 'utf-8'))
      .toBe(await readFixturePath('shouldBe.html'));
  });

  test('img', async () => {
    expect(await readFile('assets-professions-nodejs.jpg')).toBe(await readFixturePath('nodejs.jpg'));
  });

  test('link', async () => {
    expect(await readFile('assets-application.css')).toBe(await readFixturePath('application.css'));
  });

  test('script', async () => {
    expect(await readFile('packs-js-runtime.js')).toBe(await readFixturePath('runtime.js'));
  });
});

describe('Ошибки', () => {
  test('error 400', async () => {
    await expect(logic('https://ru.hexlet.io/courses', tempDir)).rejects.toThrowError();
  });

  test('Ошибочный путь к сохранению', async () => {
    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200);

    await expect(logic('https://ru.hexlet.io/courses', 'error')).rejects.toThrowError();
  });
});

// afterAll(async () => rmdirSync(tempDir, { recursive: true }));
