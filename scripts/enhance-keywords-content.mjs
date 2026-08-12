import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Otimização de <title> e meta description com palavras-chave de busca reais.
// Base de decisão: buscas como "criação de landing page", "criar site para negócio",
// "landing page para [segmento]", "quanto custa landing page", "site com WhatsApp".
const metaUpdates = [
  {
    file: 'index.html',
    title: 'Criação de Landing Page e Sites para Negócios | Lead Finder Brasil',
    desc: 'Criação de landing pages e sites profissionais com WhatsApp para pequenos negócios em todo o Brasil. Página pronta em 5 a 7 dias, atendimento online, R$ 650.',
  },
  {
    file: 'servicos/index.html',
    title: 'Criação de Landing Page: o que está incluído no Pacote Essencial',
    desc: 'Escopo completo da criação de landing page: página responsiva, botão de WhatsApp, SEO técnico básico, publicação e revisões. Descubra o que está incluído e o que é contratado à parte.',
  },
  {
    file: 'sobre/index.html',
    title: 'Quem cria as landing pages da Lead Finder Brasil | Sobre',
    desc: 'Conheça Bruno F. Salustiano, responsável pela criação de landing pages da Lead Finder Brasil, e entenda o processo de trabalho para pequenos negócios em todo o Brasil.',
  },
  {
    file: 'presenca-digital/index.html',
    title: 'Landing Page ajuda a aparecer no Google? Presença digital e IA',
    desc: 'Entenda como uma landing page profissional pode apoiar a presença no Google, em buscas locais como empresas perto de mim e na descoberta por ferramentas de IA.',
  },
  {
    file: 'privacidade/index.html',
    title: 'Política de Privacidade | Lead Finder Brasil',
    desc: 'Política de privacidade da Lead Finder Brasil: sem cookies próprios, sem analytics, sem formulários. Como funcionam os contatos externos e o tratamento de informações.',
  },
  {
    file: 'barbearia/index.html',
    title: 'Landing Page para Barbearia: exemplo de site com preços e WhatsApp',
    desc: 'Demonstração de landing page para barbearia com serviços, preços, galeria e contato pelo WhatsApp. Veja como uma página profissional pode apresentar sua barbearia.',
  },
  {
    file: 'oficina/index.html',
    title: 'Landing Page para Oficina Mecânica: exemplo com orçamento e WhatsApp',
    desc: 'Demonstração de landing page para oficina mecânica com serviços, orçamento, localização e WhatsApp. Veja como organizar a apresentação da sua oficina.',
  },
  {
    file: 'restaurante/index.html',
    title: 'Landing Page para Restaurante: exemplo com cardápio e WhatsApp',
    desc: 'Demonstração de landing page para restaurante com cardápio, horários, reservas, localização e WhatsApp. Veja como apresentar seu restaurante em uma página.',
  },
  {
    file: 'prestador-servicos/index.html',
    title: 'Landing Page para Prestador de Serviços: exemplo com WhatsApp',
    desc: 'Demonstração de landing page para prestador de serviços com especialidades, regiões atendidas, orçamento e WhatsApp. Organize sua apresentação profissional.',
  },
];

for (const { file, title, desc } of metaUpdates) {
  const fullPath = resolve(root, file);
  let content = await readFile(fullPath, 'utf8');

  content = content.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`);
  const descTag = `content="${desc}"`;
  if (!content.includes(descTag)) {
    content = content.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" ${descTag}`,
    );
  }
  await writeFile(fullPath, content, 'utf8');
  process.stdout.write(`meta-updated | ${file}\n`);
}

process.stdout.write('keyword-meta-enhance | done\n');
