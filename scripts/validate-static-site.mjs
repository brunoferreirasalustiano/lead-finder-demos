import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = [
  'index.html',
  'barbearia/index.html',
  'oficina/index.html',
  'restaurante/index.html',
  'prestador-servicos/index.html',
];
const requiredFiles = [...htmlFiles, 'assets/styles.css', 'assets/script.js', '.nojekyll'];
const authorizedWhatsapp = Object.freeze({
  phone: '5519971519337',
  baseUrl: 'https://wa.me/',
});
const problems = new Map();

function report(path, category) {
  const key = `${path}\0${category}`;
  problems.set(key, `${path} | ${category}`);
}

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

function localPathFromReference(sourcePath, reference) {
  const clean = reference.split('#', 1)[0].split('?', 1)[0];
  if (!clean || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(clean)) return null;
  if (clean.startsWith('/')) {
    report(sourcePath, 'root-absolute-reference');
    return null;
  }
  const target = resolve(root, dirname(sourcePath), decodeURIComponent(clean));
  const withinRoot = target === root || target.startsWith(`${root}${sep}`);
  if (!withinRoot) {
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
  if (!/(?:fictíci[oa]s?|fictícios)/iu.test(content)) report(path, 'fictional-content-notice-missing');
  if (/<script\b[^>]*\bsrc=["'](?:https?:)?\/\//i.test(content)) report(path, 'remote-script');
  if (/<form\b[^>]*\baction=["'](?:https?:)?\/\//i.test(content)) report(path, 'external-form-action');

  const referencePattern = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  for (const match of content.matchAll(referencePattern)) {
    const target = localPathFromReference(path, match[1]);
    if (target && !(await isFile(target))) report(path, 'local-reference-missing');
  }
}

for (const path of ['assets/styles.css', 'assets/script.js', ...htmlFiles]) {
  if (!(await isFile(resolve(root, path)))) continue;
  const content = await readFile(resolve(root, path), 'utf8');
  const withoutRemoteAssetUrls = content.replace(/https?:\/\/(?:images\.)?unsplash\.com\/[^\s"'<>)]*/gi, '[remote-image]');
  const contactSafeSource = path === 'assets/script.js'
    ? withoutRemoteAssetUrls
        .replaceAll(authorizedWhatsapp.baseUrl, '[authorized-whatsapp-base]')
        .replaceAll(authorizedWhatsapp.phone, '[authorized-phone]')
    : withoutRemoteAssetUrls;

  if (path === 'assets/script.js') {
    if (!content.includes(`const whatsappNumber='${authorizedWhatsapp.phone}'`)) report(path, 'authorized-whatsapp-number-missing');
    if (!content.includes(`const whatsappBase='${authorizedWhatsapp.baseUrl}'`)) report(path, 'authorized-whatsapp-base-missing');
  }

  const checks = [
    ['localhost-or-loopback', /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0)\b/i, content],
    ['tracking-or-analytics', /(?:google-analytics\.com|googletagmanager\.com|facebook\.com\/tr|connect\.facebook\.net|hotjar\.com|clarity\.ms|segment\.com|analytics\s*\()/i, content],
    ['network-api', /\b(?:fetch\s*\(|XMLHttpRequest\b|WebSocket\s*\()/i, content],
    ['secret-pattern', /(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{20,}|\bAKIA[0-9A-Z]{16}\b|\b(?:api[_-]?key|client[_-]?secret|access[_-]?token)\s*[:=]\s*["'][^"']{8,})/i, content],
    ['phone-number', /(?:\+?55\s*)?(?:\(?\d{2}\)?[\s.-]*)?9?\d{4}[\s.-]*\d{4}\b/, contactSafeSource],
    ['real-contact-link', /(?:mailto:|tel:|https?:\/\/(?:wa\.me|api\.whatsapp\.com))/i, contactSafeSource],
  ];
  for (const [category, pattern, source] of checks) {
    if (pattern.test(source)) report(path, category);
  }

  if (extname(path) === '.css') {
    for (const match of content.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      const target = localPathFromReference(path, match[1]);
      if (target && !(await isFile(target))) report(path, 'local-reference-missing');
    }
  }
}

const output = [...problems.values()].sort((a, b) => a.localeCompare(b, 'en'));
if (output.length) {
  process.stderr.write(`${output.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write('static-site | valid\n');
}
