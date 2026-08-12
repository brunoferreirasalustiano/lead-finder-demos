// Aprofunda a seção "Quanto custa criar uma landing page?" da home com
// comparação de formatos de mercado (2026). Reusa exclusivamente classes CSS
// existentes (service-list, service-item, service-price, notice, highlight).

import { readFileSync, writeFileSync } from "node:fs";

const target = "index.html";
const find =
  "<p>Transparência sobre o valor e sobre as decisões que fazem o preço variar no mercado brasileiro.</p>";

const insert = `
  <div class="service-list" style="margin-top:28px">
    <div class="service-item"><div><b>Landing page com plataforma pronta (arrastar e soltar)</b><p>Mensalidade recorrente durante todo o tempo de uso.</p></div><span class="service-price">R$ 50–200/mês</span></div>
    <div class="service-item"><div><b>Landing page com freelancer ou agência</b><p>Varia muito conforme escopo, design e integrações.</p></div><span class="service-price">R$ 500–15.000</span></div>
    <div class="service-item" style="border-color:var(--brand)"><div><b>Pacote Essencial Lead Finder</b><p>Pagamento único, botão de WhatsApp, pronta em 5 a 7 dias úteis.</p></div><span class="service-price">R$ 650</span></div>
  </div>
  <div class="notice" style="margin-top:18px">Faixas de referência divulgadas em 2026 por bqhost.com.br, safiradesign.com.br e studioartemis.co. Não constituem média oficial do mercado.</div>`;

let html = readFileSync(target, "utf8");
if (!html.includes(find)) {
  console.error(`[ERRO] padrão não encontrado em ${target}`);
  process.exit(1);
}
html = html.replace(find, find + insert);
writeFileSync(target, html);
console.log("[OK]", target);
