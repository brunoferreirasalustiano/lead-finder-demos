import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = resolve(root, '.pages-artifact');
const allowlist = [
  'index.html',
  '.nojekyll',
  'assets',
  'barbearia',
  'oficina',
  'restaurante',
  'prestador-servicos',
];

if (!destination.startsWith(`${root}${sep}`)) throw new Error('unsafe artifact destination');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });

for (const entry of allowlist) {
  const source = resolve(root, entry);
  const target = resolve(destination, entry);
  await cp(source, target, { recursive: (await stat(source)).isDirectory() });
}

const actual = (await readdir(destination)).sort();
const expected = [...allowlist].sort();
if (actual.length !== expected.length || actual.some((entry, index) => entry !== expected[index])) {
  throw new Error('artifact allowlist mismatch');
}

for (const forbidden of ['.git', '.github', 'README.md', 'scripts']) {
  const candidate = resolve(destination, forbidden);
  try {
    await stat(candidate);
    throw new Error(`forbidden artifact entry: ${relative(root, candidate)}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

process.stdout.write('pages-artifact | valid\n');
