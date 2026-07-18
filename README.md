# Lead Finder Brasil — Landing Pages Demonstrativas

Catálogo estático e responsivo com quatro demonstrações comerciais:

- Barbearia e salão de beleza
- Oficina mecânica e auto center
- Restaurante, pizzaria ou lanchonete
- Prestadores de serviços locais

## Objetivo

Apoiar o piloto interno da Lead Finder Brasil com exemplos visuais que possam ser enviados somente após autorização do potencial cliente.

## Princípios

- nenhuma empresa real é representada;
- nomes, preços e endereços são fictícios;
- sem rastreamento, cookies ou coleta de dados;
- sem integração real com WhatsApp;
- botões comerciais são apenas demonstrativos;
- páginas responsivas e sem dependências externas.

## Estrutura

```text
lead-finder-demos/
├── index.html
├── barbearia/
├── oficina/
├── restaurante/
├── prestador-servicos/
├── assets/
├── scripts/
├── .github/workflows/
├── .nojekyll
└── README.md
```

## Execução local

Abra `index.html` diretamente no navegador ou use um servidor estático:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Validação estática

O validador usa somente APIs nativas do Node.js e não instala dependências:

```bash
node scripts/validate-static-site.mjs
```

Exit code `0` indica que as regras estruturais, de privacidade e de segurança foram atendidas. Qualquer outro exit code bloqueia a publicação e lista somente o caminho e a categoria do problema.

## Publicação no GitHub Pages

O site é validado, empacotado por allowlist e publicado por GitHub Actions após push na branch `main`. O artefato contém somente as páginas, `.nojekyll` e os assets públicos.

URL esperada após um deployment bem-sucedido:

`https://brunoferreirasalustiano.github.io/lead-finder-demos/`

Se a URL ainda retornar 404 e não houver deployment verde, acesse **Settings → Pages** e, em **Build and deployment**, selecione **GitHub Actions**. A presença dos arquivos no repositório não comprova que Pages está habilitado ou que um deployment terminou com sucesso.

## Uso controlado

As páginas usam exclusivamente nomes, endereços, preços e demais dados fictícios. Nenhuma demonstração autoriza contato, envia dados ou habilita integração externa. O link só deve ser apresentado a um potencial cliente após autorização manual.
