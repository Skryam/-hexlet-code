import fs from 'node:fs/promises';
import path from 'node:path';
import logic from '../src/index.js';
import nock from 'nock';
import os from 'node:os';

nock.disableNetConnect();

const deleteFiles = () => {
  fs.readdir(os.tmpdir())
  .then((files) => files.filter(f => f.match(/page-loader-.*/)).forEach(del => fs.rmdir(`${os.tmpdir()}/${del}`, {recursive: true})))
  .catch(e => console.log(e));
}

beforeAll(() => {
  deleteFiles();
})

let makeTempDir;
beforeEach(async () => {
  makeTempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
})

test('saved htpp-file', async () => {
  const scope = nock('https://ru.hexlet.io')
  .get('/courses')
  .reply(200, ['norm']);

  const res = await logic('https://ru.hexlet.io/courses', makeTempDir)
  expect(scope.isDone()).toBe(true);
  expect(await fs.readFile(res, 'utf-8')).toBe('norm')
})