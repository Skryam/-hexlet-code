import fs from 'node:fs/promises';
import path from 'node:path';
import nock from 'nock';
import os from 'node:os';
import { fileURLToPath } from 'url';
import { rmdirSync } from 'node:fs';
import logic from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readFixturePath = async (filename) => fs.readFile(path.join(__dirname, '..', '__fixtures__', filename), 'utf-8');

nock.disableNetConnect();

let tempDir;
let content;
let imgContent;
let linkContent;
let scriptContent;
beforeAll(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  content = await fs.readFile('./__fixtures__/courses.html', 'utf-8');
  imgContent = await fs.readFile('./__fixtures__/nodejs.jpg', 'utf-8');
  linkContent = await fs.readFile('./__fixtures__/application.css', 'utf-8');
  scriptContent = await fs.readFile('./__fixtures__/runtime.js', 'utf-8');
});

const readResultFile = async (fileName) => fs.readFile(path.join(tempDir, 'ru-hexlet-io-courses_files', `ru-hexlet-io-${fileName}`), 'utf-8');

describe('Download html and files', () => {
  test('html', async () => {
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
    expect(await readResultFile('assets-professions-nodejs.jpg')).toBe(imgContent);
  });

  test('link', async () => {
    expect(await readResultFile('assets-application.css')).toBe(linkContent);
  });

  test('script', async () => {
    expect(await readResultFile('packs-js-runtime.js')).toBe(scriptContent);
  });
});

describe('Errors axios & node files', () => {
  test('response 400', async () => {
    nock('https://ru.hexlet.io')
      .get('/courses')
     .reply(400);

    await expect(logic('https://ru.hexlet.io/courses', tempDir)).rejects.toThrowError();
  });

  test('error path to save', async () => {
    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200);

    await expect(logic('https://ru.hexlet.io/courses', 'errorPath')).rejects.toThrowError();
  });
})

afterAll(async () => rmdirSync(tempDir, { recursive: true }));
