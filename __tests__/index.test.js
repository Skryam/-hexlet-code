import fs from 'node:fs/promises';
import path from 'node:path';
import logic from '../src/index.js';
import nock from 'nock';
import os from 'node:os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

const deleteFiles = () => {
  fs.readdir(os.tmpdir())
  .then((files) => files.filter(f => f.match(/page-loader-.*/)).forEach(del => fs.rmdir(`${os.tmpdir()}/${del}`, {recursive: true})))
  .catch(e => console.log(e));
}

/*beforeAll(() => {
  deleteFiles();
})*/

let makeTempDir;
beforeEach(async () => {
  makeTempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test', 'page-loader-'));
})

test('saved image', async () => {
  const scope = nock('https://ru.hexlet.io')
  .get('/courses')
  .reply(200, await fs.readFile('./__fixtures__/courses.html'));

  const scopeIMG = nock('https://ru.hexlet.io/courses')
  .get('/assets/professions/nodejs.jpg')
  .reply(200, await fs.readFile('./__fixtures__/nodejs.jpg'))

  const res = await logic('https://ru.hexlet.io/courses', makeTempDir);

  expect(scope.isDone()).toBe(true);
})
