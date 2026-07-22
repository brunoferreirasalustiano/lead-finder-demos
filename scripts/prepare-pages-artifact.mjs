import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = resolve(root, '.pages-artifact');
const allowlist = [
  'index.html',
  '.nojekyll',
  'robots.txt',
  'sitemap.xml',
  'assets',
  'barbearia',
  'oficina',
  'restaurante',
  'prestador-servicos',
];

const heroPrimaryCopy = 'Criamos páginas rápidas, responsivas e personalizadas para pequenos negócios de todo o Brasil apresentarem seus serviços e facilitarem o contato de novos clientes.';
const heroSecondaryCopy = 'Uma landing page bem estruturada fortalece a presença orgânica do seu negócio, ajuda o Google e ferramentas de IA a compreenderem seus serviços e aumenta as chances de descoberta em buscas regionais, como “serviços perto de mim” e “empresas perto de mim”.';

if (!destination.startsWith(`${root}${sep}`)) throw new Error('unsafe artifact destination');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });

for (const entry of allowlist) {
  const source = resolve(root, entry);
  const target = resolve(destination, entry);
  await cp(source, target, { recursive: (await stat(source)).isDirectory() });
}

const artifactHome = resolve(destination, 'index.html');
const homeContent = await readFile(artifactHome, 'utf8');
const heroPrimaryMarkup = `<p class="lead">${heroPrimaryCopy}</p>`;
const heroSecondaryMarkup = `<p class="lead" style="font-size:1rem;margin-top:14px;color:var(--ink);font-weight:750">${heroSecondaryCopy}</p>`;

if (!homeContent.includes(heroPrimaryMarkup)) {
  throw new Error('hero primary copy not found for secondary slogan');
}

const homeWithSecondarySlogan = homeContent.replace(
  heroPrimaryMarkup,
  `${heroPrimaryMarkup}${heroSecondaryMarkup}`,
);

if (!homeWithSecondarySlogan.includes(heroSecondaryCopy)) {
  throw new Error('secondary slogan injection failed');
}

await writeFile(artifactHome, homeWithSecondarySlogan, 'utf8');

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
