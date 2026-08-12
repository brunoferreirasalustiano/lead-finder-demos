import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Conteúdo novo é inserido como <p class="lead">-style dentro de <main>,
// antes do </main>, usando classes existentes do site (section/section-head/lead).
// O objetivo é responder explicitamente às buscas que o público faz:
// "quanto custa uma landing page", "criar site para meu negócio", etc.

const homeAddition = `
        <section class="section" id="custo" aria-label="Custo de landing page"><div class="container"><div class="section-head reveal"><div><span class="eyebrow">Investimento</span><h2>Quanto custa criar uma landing page?</h2></div><p>Transparência sobre o valor e sobre as decisões que fazem o preço variar no mercado brasileiro.</p></div><div class="steps"><a class="step" href="#oferta" style="text-decoration:none;color:inherit"><b>01</b><h3>Pacote Essencial · R$ 650</h3><p>Landing page profissional completa, com botão de WhatsApp, pronta em cinco a sete dias úteis, sem mensalidade obrigatória.</p></a><a class="step" href="#oferta" style="text-decoration:none;color:inherit"><b>02</b><h3>Sem mensalidade obrigatória</h3><p>Pagamento único no Pix ou cartão. Domínio, hospedagem recorrente e manutenção são definidos separadamente, sem surpresas.</p></a><a class="step" href="#oferta" style="text-decoration:none;color:inherit"><b>03</b><h3>Para todo o Brasil</h3><p>O projeto é conduzido online para pequenos negócios de qualquer estado: barbearias, oficinas, restaurantes, prestadores de serviço e outros segmentos.</p></a></div></div></section>`.trim();

const servicosAddition = `
        <section class="section" aria-label="Perguntas sobre o serviço"><div class="container"><div class="section-head reveal"><div><span class="eyebrow">Para decidir</span><h2>O que avaliar antes de contratar uma landing page.</h2></div></div><div class="steps"><a class="step" href="../" style="text-decoration:none;color:inherit"><b>01</b><h3>Responsividade</h3><p>A página precisa funcionar bem em celulares e computadores, pois a maior parte dos clientes pesquisa pelo telefone.</p></a><a class="step" href="../" style="text-decoration:none;color:inherit"><b>02</b><h3>Caminho de contato claro</h3><p>Botões que encaminham diretamente para o WhatsApp do negócio reduzem atrito e aceleram a primeira conversa.</p></a><a class="step" href="../" style="text-decoration:none;color:inherit"><b>03</b><h3>Texto legível por buscadores</h3><p>Conteúdo escrito diretamente no HTML permite que o Google e as ferramentas de IA compreendam os serviços oferecidos.</p></a></div></div></section>`.trim();

const presencaAddition = `
        <section class="section" aria-label="Buscas regionais"><div class="container"><div class="section-head reveal"><div><span class="eyebrow">Buscas regionais</span><h2>Como o cliente encontra negócios como o seu.</h2></div></div><div class="steps"><a class="step" href="../" style="text-decoration:none;color:inherit"><b>01</b><h3>Pesquisas locais</h3><p>Buscas como "empresa perto de mim" e "serviço perto de mim" são a porta de entrada de muitos clientes novos na região.</p></a><a class="step" href="../" style="text-decoration:none;color:inherit"><b>02</b><h3>Google e IA</h3><p>Uma página com informações claras, dados estruturados e links internos ajuda buscadores e ferramentas de IA a compreenderem e recomendarem o negócio.</p></a><a class="step" href="../" style="text-decoration:none;color:inherit"><b>03</b><h3>Consistência da marca</h3><p>Nome, endereço, telefone e serviços apresentados de forma idêntica em todos os canais reforçam a confiança de quem busca.</p></a></div></div></section>`.trim();

const additions = [
  { file: 'index.html', text: homeAddition, marker: 'aria-label="Custo de landing page"' },
  { file: 'servicos/index.html', text: servicosAddition, marker: 'aria-label="Perguntas sobre o serviço"' },
  { file: 'presenca-digital/index.html', text: presencaAddition, marker: 'aria-label="Buscas regionais"' },
];

for (const { file, text, marker } of additions) {
  const fullPath = resolve(root, file);
  let content = await readFile(fullPath, 'utf8');
  if (!content.includes(marker)) {
    content = content.replace('</main>', `${text}\n      </main>`);
    await writeFile(fullPath, content, 'utf8');
    process.stdout.write(`content-enriched | ${file}\n`);
  } else {
    process.stdout.write(`skipped    | ${file}\n`);
  }
}

process.stdout.write('body-content-enrich | done\n');
