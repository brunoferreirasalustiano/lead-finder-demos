# Lead Finder Brasil — Landing Pages Demonstrativas

Catálogo estático, responsivo e orientado à conversão para negócios locais.

## Demonstrações

- barbearia e salão;
- oficina mecânica e auto center;
- restaurante e lanchonete;
- prestadores de serviços locais.

## Direção do projeto

O site usa uma linguagem visual editorial e comercial, evitando aparência genérica de template. A implementação é feita em HTML semântico, CSS moderno e JavaScript enxuto, sem frameworks, fontes externas ou bibliotecas de animação.

Características:

- mobile first e responsivo;
- CTAs claros para WhatsApp;
- animações limitadas a `transform` e `opacity`;
- efeitos de profundidade executados com `requestAnimationFrame`;
- suporte a `prefers-reduced-motion`;
- `content-visibility` em seções abaixo da dobra;
- sem cookies, analytics, formulários ou coleta de dados;
- nomes, preços, endereços e empresas fictícios nas demonstrações.

## Configuração do WhatsApp da Lead Finder Brasil

O único ponto autorizado para armazenar o número comercial público é:

```text
assets/contact-config.js
```

Enquanto o número não estiver disponível, mantenha:

```js
window.LEAD_FINDER_CONTACT = Object.freeze({
  enabled: false,
  whatsapp: '',
  message: 'Olá, Bruno! Conheci a Lead Finder Brasil e gostaria de avaliar uma landing page para o meu negócio.'
});
```

Depois de receber o número do WhatsApp Business, use apenas dígitos com DDI e DDD, por exemplo `55...`, e altere `enabled` para `true`. O validador bloqueia números espalhados em outros arquivos.

## Execução local

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Validação estática

```bash
node scripts/validate-static-site.mjs
```

O validador verifica estrutura, referências locais, política `noindex,nofollow`, ausência de tracking, segredos, APIs de rede, formulários e contatos reais fora do arquivo autorizado.

## Publicação

O GitHub Pages é publicado por Actions após push na `main`, usando um artefato preparado por allowlist.

URL:

`https://brunoferreirasalustiano.github.io/lead-finder-demos/`

## Uso comercial controlado

O link de uma demonstração deve ser enviado somente após autorização do potencial cliente. Botões de WhatsApp das empresas fictícias não realizam contato. O canal real da Lead Finder Brasil só é ativado após configuração explícita do número comercial.
