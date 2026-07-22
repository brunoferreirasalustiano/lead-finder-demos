# Lead Finder Brasil — Demonstrações

Catálogo estático e responsivo de landing pages demonstrativas para pequenos negócios.

**Site público:** https://brunoferreirasalustiano.github.io/lead-finder-demos/

## Segmentos

- barbearia;
- oficina mecânica;
- restaurante;
- prestadores de serviços.

Todas as empresas, marcas, endereços, preços internos e demais informações das demonstrações são fictícios. As páginas mostram estrutura, design e organização de conteúdo; não representam clientes reais nem resultados comprovados.

## Oferta apresentada

**Landing Page Essencial — R$ 650**

Pagamento por Pix ou cartão em até 10 parcelas, conforme as condições da operadora.

Escopo apresentado no site:

- uma página responsiva;
- personalização de identidade, cores, textos e imagens;
- serviços, valores, horários e diferenciais;
- botões para WhatsApp, Instagram e localização;
- SEO técnico básico e publicação;
- uma rodada de ajustes.

Domínio, hospedagem recorrente, manutenção, loja, pagamentos, agenda integrada e funcionalidades avançadas são tratados separadamente.

## WhatsApp comercial

Os botões `data-contact` são conectados pelo JavaScript compartilhado ao WhatsApp oficial da Lead Finder Brasil.

O comportamento é exclusivamente manual:

1. o visitante toca no botão;
2. o navegador abre um link seguro `wa.me` em nova aba;
3. uma mensagem inicial é preenchida;
4. o visitante decide se envia a conversa.

O site não envia mensagens automaticamente, não chama a WhatsApp Cloud API, não usa WhatsApp Web automatizado e não confirma que uma mensagem foi enviada.

Os links usam `noopener noreferrer`. O número e a mensagem ficam centralizados em `assets/script.js` para evitar divergência entre as páginas.

## Privacidade e segurança

O site não possui:

- formulários;
- cookies próprios;
- analytics;
- tracking;
- armazenamento local;
- banco de dados;
- autenticação;
- coleta de telefone, e-mail ou mensagem;
- provider de envio;
- webhook.

O catálogo é independente do runtime do repositório `lead-finder-sem-site`. O fato de o site abrir o WhatsApp manualmente não significa que o CRM possua provider WhatsApp habilitado.

## Conteúdo comercial

Foram removidos:

- avaliações ilustrativas;
- antiguidade fictícia;
- números decorativos que poderiam parecer métricas;
- mensagens antigas dizendo que o WhatsApp estava desativado;
- textos que poderiam sugerir domínio incluído.

O HTML é a fonte do conteúdo. O JavaScript cuida apenas de menu, FAQ, ano, WhatsApp e efeitos visuais.

## Imagens e performance

As imagens ainda usam URLs externas do Unsplash, com dimensões declaradas, `loading="lazy"` quando aplicável e `referrerpolicy="no-referrer"`.

Pendência registrada na [issue #7](https://github.com/brunoferreirasalustiano/lead-finder-demos/issues/7):

- confirmar direitos aplicáveis de cada imagem;
- substituir os hotlinks por arquivos locais otimizados;
- preservar proporções e evitar layout shift;
- reduzir dependência externa.

A substituição não deve alterar o visual aprovado sem nova revisão.

## Acessibilidade e efeitos

- link para pular ao conteúdo;
- navegação por teclado;
- atributos ARIA no menu e FAQ;
- textos alternativos nas imagens relevantes;
- animações desativadas ou simplificadas com `prefers-reduced-motion`;
- efeito de desdobramento acionado por `IntersectionObserver`, com fallback.

## Validação local

```bash
node scripts/validate-static-site.mjs
```

O validador verifica a estrutura do site e bloqueia regressões relevantes antes da publicação.

## Publicação

A workflow `Publish static site to Pages`:

1. executa a validação estática em pull requests;
2. prepara somente os arquivos permitidos;
3. publica no GitHub Pages após merge aprovado na branch `main`.

Mudanças maiores devem usar branch e pull request. Nenhuma PR deve ser integrada com validação vermelha ou finding aberto.