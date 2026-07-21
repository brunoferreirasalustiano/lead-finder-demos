import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = [
  'index.html',
  'barbearia/index.html',
  'oficina/index.html',
  'restaurante/index.html',
  'prestador-servicos/index.html',
];
const requiredFiles = [
  ...htmlFiles,
  'assets/landing.css',
  'assets/landing.js',
  'assets/demo-premium.css',
  'assets/demo-premium.js',
  'assets/contact-config.js',
  '.nojekyll',
];
const problems = new Map();
const report = (path, category) => problems.set(`${path}\0${category}`, `${path} | ${category}`);

async function isFile(path) {
  try { return (await stat(path)).isFile(); } catch { return false; }
}

async function collectFiles(directory, extensions) {
  const result = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const absolute = resolve(current, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (extensions.has(extname(entry.name))) result.push(relative(root, absolute).split(sep).join('/'));
    }
  }
  await walk(resolve(root, directory));
  return result.sort();
}

function localPathFromReference(sourcePath, reference) {
  const clean = reference.split('#', 1)[0].split('?', 1)[0];
  if (!clean || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(clean)) return null;
  if (clean.startsWith('/')) { report(sourcePath, 'root-absolute-reference'); return null; }
  const target = resolve(root, dirname(sourcePath), decodeURIComponent(clean));
  if (!(target === root || target.startsWith(`${root}${sep}`))) {
    report(sourcePath, 'reference-outside-site');
    return null;
  }
  return clean.endsWith('/') ? resolve(target, 'index.html') : target;
}

for (const path of requiredFiles) {
  if (!(await isFile(resolve(root, path)))) report(path, 'required-file-missing');
}

for (const path of htmlFiles) {
  if (!(await isFile(resolve(root, path)))) continue;
  const content = await readFile(resolve(root, path), 'utf8');
  if (!/<html\b[^>]*\blang=["']pt-BR["']/i.test(content)) report(path, 'lang-pt-br-missing');
  if (!/<meta\b[^>]*\bname=["']viewport["'][^>]*>/i.test(content)) report(path, 'viewport-missing');
  if (!/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*noindex\s*,\s*nofollow[^"']*["']/i.test(content)) report(path, 'robots-policy-missing');
  if (!/<meta\b[^>]*\bcharset=["']?utf-8/i.test(content)) report(path, 'charset-missing');
  if (!/<title>\s*[^<]+\s*<\/title>/i.test(content)) report(path, 'title-missing');
  if (!/<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'][^"']+["']/i.test(content)) report(path, 'description-missing');
  if (!/fictíci[oa]s?/iu.test(content)) report(path, 'fictional-content-notice-missing');
  if (/<form\b/i.test(content)) report(path, 'form-not-allowed');
  if (/(?:mailto:|tel:|https?:\/\/(?:wa\.me|api\.whatsapp\.com))/i.test(content)) report(path, 'static-real-contact-link');
  if (/<(?:script|link|img|source|iframe)\b[^>]*(?:src|href)=["'](?:https?:)?\/\//i.test(content)) report(path, 'remote-asset-reference');

  for (const match of content.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const target = localPathFromReference(path, match[1]);
    if (target && !(await isFile(target))) report(path, 'local-reference-missing');
  }
}

const assetFiles = await collectFiles('assets', new Set(['.css', '.js']));
const publicFiles = [...htmlFiles, ...assetFiles];
const phonePattern = /(?:\+?55\s*)?(?:\(?\d{2}\)?[\s.-]*)?9?\d{4}[\s.-]*\d{4}\b/;
const checks = [
  ['localhost-or-loopback', /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0)\b/i],
  ['tracking-or-analytics', /(?:google-analytics\.com|googletagmanager\.com|facebook\.com\/tr|connect\.facebook\.net|hotjar\.com|clarity\.ms|segment\.com|analytics\s*\()/i],
  ['network-api', /\b(?:fetch\s*\(|XMLHttpRequest\b|WebSocket\s*\()/i],
  ['secret-pattern', /(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{20,}|\bAKIA[0-9A-Z]{16}\b|\b(?:api[_-]?key|client[_-]?secret|access[_-]?token)\s*[:=]\s*["'][^"']{8,})/i],
];
for (const path of publicFiles) {
  if (!(await isFile(resolve(root, path)))) continue;
  const content = await readFile(resolve(root, path), 'utf8');
  for (const [category, pattern] of checks) if (pattern.test(content)) report(path, category);
  if (path !== 'assets/contact-config.js' && phonePattern.test(content)) report(path, 'phone-number-outside-contact-config');
  if (extname(path) === '.css') {
    for (const match of content.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      const target = localPathFromReference(path, match[1]);
      if (target && !(await isFile(target))) report(path, 'local-reference-missing');
    }
  }
}

const configPath = 'assets/contact-config.js';
if (await isFile(resolve(root, configPath))) {
  try {
    const source = await readFile(resolve(root, configPath), 'utf8');
    const sandbox = { window: {} };
    vm.runInNewContext(source, sandbox, { timeout: 100, filename: configPath });
    const config = sandbox.window.LEAD_FINDER_CONTACT;
    if (!config || typeof config !== 'object') report(configPath, 'contact-config-object-missing');
    else {
      const keys = Object.keys(config).sort();
      if (keys.join(',') !== 'enabled,message,whatsapp') report(configPath, 'contact-config-keys-invalid');
      if (typeof config.enabled !== 'boolean') report(configPath, 'contact-enabled-invalid');
      if (typeof config.whatsapp !== 'string') report(configPath, 'contact-whatsapp-invalid');
      if (typeof config.message !== 'string' || config.message.length < 10 || config.message.length > 300) report(configPath, 'contact-message-invalid');
      const digits = typeof config.whatsapp === 'string' ? config.whatsapp.replace(/\D/g, '') : '';
      if (config.enabled === false && digits !== '') report(configPath, 'disabled-contact-must-be-empty');
      if (config.enabled === true && !/^55\d{10,11}$/.test(digits)) report(configPath, 'enabled-contact-number-invalid');
    }
  } catch {
    report(configPath, 'contact-config-execution-invalid');
  }
}

const output = [...problems.values()].sort((a, b) => a.localeCompare(b, 'en'));
if (output.length) {
  process.stderr.write(`${output.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write('static-site | valid\n');
}
