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

let makeTempDir;
let courses;
let nodejsJPG;
let application;
let runtime;
beforeAll(async () => {
  makeTempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test', 'page-loader-'));
  courses = await fs.readFile('./__fixtures__/courses.html');
  nodejsJPG = await fs.readFile('./__fixtures__/nodejs.jpg');
  application = await fs.readFile('./__fixtures__/application.css');
  runtime = await fs.readFile('./__fixtures__/runtime.js');
});

const readFile = async (fileName) => await fs.readFile(path.join(makeTempDir, 'ru-hexlet-io-courses_files', `ru-hexlet-io-${fileName}`), 'utf-8');

test('get http', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, courses)
    .get('/courses')
    .reply(200, courses)
    .get('/assets/professions/nodejs.jpg')
    .reply(200, nodejsJPG)
    .get('/assets/application.css')
    .reply(200, application)
    .get('/packs/js/runtime.js')
    .reply(200, runtime);

  await logic('https://ru.hexlet.io/courses', makeTempDir);

  expect(await readFile('assets-professions-nodejs.jpg')).toBe(await readFixturePath('nodejs.jpg'));
});

/* test('error 400', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(400);

  await expect(logic('https://ru.hexlet.io/courses', makeTempDir)).rejects.toThrowError();
});

test('ошибочный путь к сохранению', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200);

  await expect(logic('https://ru.hexlet.io/courses', 'error')).rejects.toThrowError();
}); */

// afterAll(async () => rmdirSync(makeTempDir, { recursive: true }));
