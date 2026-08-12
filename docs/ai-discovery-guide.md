# Guia de descoberta por mecanismos de busca e sistemas de IA

Este documento resume como o site `lead-finder-demos` se apresenta a mecanismos de busca, recursos de IA do Google e rastreadores de sistemas de inteligência artificial. Ele complementa o `README.md` e o plano de domínio e autoridade em `docs/domain-and-authority-plan.md`.

## Identidade da entidade

A marca **Lead Finder Brasil** é descrita de forma consistente em todas as páginas por meio de dados estruturados `Organization` com `@id` fixo (`https://brunoferreirasalustiano.github.io/lead-finder-demos/#organization`), `WebSite` e `Service`. As demais páginas referem-se à mesma entidade pelos mesmos identificadores, de modo que rastreadores e modelos de linguagem possam associar nome, descrição, contatos oficiais e área de atuação (Brasil) a um único perfil de entidade.

| Campo | Valor |
| --- | --- |
| Nome | Lead Finder Brasil |
| Responsável | Bruno F. Salustiano |
| E-mail | leadfinderbrasil@gmail.com |
| WhatsApp | (19) 97151-9337 (`wa.me/5519971519337`) |
| Área de atuação | Todo o Brasil, atendimento online |
| Oferta principal | Landing pages profissionais sob medida (Pacote Essencial, R$ 650) |

## Rastreamento e indexação

O `robots.txt` permite o acesso de todos os agentes (`User-agent: *`, `Allow: /`) e aponta para o `sitemap.xml` e o `sitemap.txt`, que listam as nove páginas indexáveis. Cada página publica uma URL canônica individual, título e meta description exclusivos, um único `h1`, `lang="pt-BR"` e política `index,follow`. O conteúdo principal está presente diretamente no HTML, sem dependência de renderização de JavaScript para leitura do texto.

## Descoberta por sistemas de IA

Os rastreadores usados pelos sistemas de IA respeitam o `robots.txt`. Como a regra geral libera todos os agentes, o site já está acessível a `Googlebot` (base dos AI Overviews e do AI Mode) e a `OAI-SearchBot` (usado pelo ChatGPT para exibir páginas em suas respostas de busca). O acesso do `GPTBot`, destinado ao treinamento de modelos, permanece liberado pela mesma regra geral; bloqueá-lo é uma decisão separada do proprietário, caso deseje impedir uso do conteúdo em treinamento.

A documentação oficial do Google afirma que os mesmos fundamentos de SEO bastam para os recursos de IA e que não há markup ou arquivo especial obrigatório. Por isso, as medidas adotadas são: conteúdo textual legível e organizado, links internos entre todas as páginas institucionais e de demonstração, dados estruturados coerentes com o texto visível e sitemap atualizado.

## Estrutura interna de links

Todas as páginas institucionais possuem um bloco de cartões linkando para Serviços, Google e buscas locais, Sobre e Privacidade. As páginas de demonstração linkam entre si, permitindo que rastreadores descubram as quatro demonstrações a partir de qualquer uma delas, sem depender exclusivamente do sitemap.

## Limites

A preparação técnica não garante indexação, primeira posição, exibição em recursos de IA ou menção por modelos. A descoberta também depende de fatores externos ao site, como autoridade do domínio, citações externas e histórico de busca.
