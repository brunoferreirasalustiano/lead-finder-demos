import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = 'https://brunoferreirasalustiano.github.io/lead-finder-demos';

const demoCatalog = [
  { slug: 'barbearia', eyebrow: 'Barbearia', title: 'Serviços, preços e agendamento bem apresentados.', desc: 'Visual editorial, serviços claros e chamada comercial direcionada ao WhatsApp.' },
  { slug: 'oficina', eyebrow: 'Oficina mecânica', title: 'Confiança e serviços no primeiro clique.', desc: 'Layout técnico, serviços organizados e caminho direto para solicitar informações.' },
  { slug: 'restaurante', eyebrow: 'Restaurante', title: 'Cardápio, horários e contato em uma página.', desc: 'Fotografia forte, menu objetivo e informações comerciais fáceis de localizar.' },
  { slug: 'prestador-servicos', eyebrow: 'Prestador de serviços', title: 'Especialidades e regiões atendidas em destaque.', desc: 'Apresentação de especialidades, áreas de atuação e orçamento pelo WhatsApp.' },
];

const institutionalCatalog = [
  { href: `${base}/servicos/`, eyebrow: '01', title: 'Serviços', desc: 'Escopo, preço, itens incluídos e serviços contratados separadamente.' },
  { href: `${base}/presenca-digital/`, eyebrow: '02', title: 'Google e buscas locais', desc: 'Como uma landing page pode apoiar presença orgânica, IA e pesquisas regionais.' },
  { href: `${base}/sobre/`, eyebrow: '03', title: 'Sobre', desc: 'Responsável, forma de trabalho e princípios adotados nos projetos.' },
  { href: `${base}/privacidade/`, eyebrow: '04', title: 'Privacidade', desc: 'Transparência sobre cookies, analytics, formulários e contato externo.' },
];

function buildInstitutionalNav() {
  const cards = institutionalCatalog
    .map(
      c =>
        `<a class="step" href="${c.href}" style="text-decoration:none;color:inherit"><b>${c.eyebrow}</b><h3>${c.title}</h3><p>${c.desc}</p></a>`,
    )
    .join('');
  return `
        <section class="section" aria-label="Páginas institucionais"><div class="container"><div class="section-head reveal"><div><span class="eyebrow">Informações institucionais</span><h2>Entenda a solução antes de decidir.</h2></div></div><div class="steps">${cards}</div></div></section>`.trim();
}

function buildDemoCatalogNav(current) {
  const others = demoCatalog.filter(d => d.slug !== current);
  const rows = others
    .map(
      (d, i) =>
        `<a class="project-row reveal" href="${base}/${d.slug}/"><div class="project-copy"><span class="eyebrow">${d.eyebrow}</span><h3>${d.title}</h3><p>${d.desc}</p><span class="project-link">Ver demonstração ↗</span></div></a>`,
    )
    .join('');
  return `
        <section class="section" aria-label="Outras demonstrações"><div class="container"><div class="section-head reveal"><div><span class="eyebrow">Mais exemplos</span><h2>Outras demonstrações por segmento.</h2></div></div><div class="projects">${rows}</div></div></section>`.trim();
}

const files = [
  { path: 'index.html', demo: null },
  { path: 'servicos/index.html', demo: null },
  { path: 'presenca-digital/index.html', demo: null },
  { path: 'sobre/index.html', demo: null },
  { path: 'privacidade/index.html', demo: null },
  { path: 'barbearia/index.html', demo: 'barbearia' },
  { path: 'oficina/index.html', demo: 'oficina' },
  { path: 'restaurante/index.html', demo: 'restaurante' },
  { path: 'prestador-servicos/index.html', demo: 'prestador-servicos' },
];

for (const { path, demo } of files) {
  const fullPath = resolve(root, path);
  let content = await readFile(fullPath, 'utf8');

  const navBlock = demo ? buildDemoCatalogNav(demo) : buildInstitutionalNav();
  const marker = demo ? 'aria-label="Outras demonstrações"' : 'aria-label="Páginas institucionais"';

  if (!content.includes(marker)) {
    content = content.replace('</main>', `${navBlock}\n      </main>`);
    await writeFile(fullPath, content, 'utf8');
    process.stdout.write(`enhanced | ${path} (${demo ?? 'institutional'})\n`);
  } else {
    process.stdout.write(`skipped  | ${path} (already present)\n`);
  }
}

process.stdout.write('seo-entity-enhance | done\n');
