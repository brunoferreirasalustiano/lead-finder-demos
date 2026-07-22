# Google Search Console — configuração operacional

## Propriedade correta enquanto o site usa GitHub Pages

Adicionar uma propriedade do tipo **Prefixo do URL** com o endereço exato:

```text
https://brunoferreirasalustiano.github.io/lead-finder-demos/
```

Não usar uma propriedade de domínio para `github.io`, porque o projeto não controla o DNS do domínio `github.io`.

## Método de verificação recomendado

Usar **Arquivo HTML**.

O Search Console fornecerá um arquivo único semelhante a:

```text
google1234567890abcdef.html
```

O conteúdo normalmente segue este formato:

```text
google-site-verification: google1234567890abcdef.html
```

O nome e o conteúdo devem ser mantidos exatamente como foram fornecidos.

## Fluxo preparado no repositório

O script `scripts/prepare-pages-artifact.mjs`:

1. procura na raiz arquivos compatíveis com `google*.html`;
2. aceita apenas nomes formados por letras, números, hífen ou sublinhado;
3. confirma que o conteúdo corresponde exatamente ao nome do arquivo;
4. copia o arquivo para a raiz do artefato publicado;
5. rejeita arquivos de verificação malformados.

A workflow cria um arquivo sintético durante a CI e confirma que ele chega corretamente ao artefato do GitHub Pages.

## Etapas que exigem acesso à conta Google

1. Abrir o Google Search Console.
2. Clicar em **Adicionar propriedade**.
3. Escolher **Prefixo do URL**.
4. Informar exatamente:

   ```text
   https://brunoferreirasalustiano.github.io/lead-finder-demos/
   ```

5. Escolher **Arquivo HTML**.
6. Baixar o arquivo fornecido pelo Google.
7. Enviar o arquivo sem renomear e sem alterar seu conteúdo.
8. Publicar o arquivo na raiz do site.
9. Confirmar em uma janela anônima que o endereço abaixo abre diretamente:

   ```text
   https://brunoferreirasalustiano.github.io/lead-finder-demos/NOME-DO-ARQUIVO.html
   ```

10. Voltar ao Search Console e clicar em **Verificar**.

O arquivo deve permanecer publicado. Removê-lo pode causar perda posterior da verificação.

## Envio do sitemap

Depois da verificação, abrir **Sitemaps** e enviar:

```text
https://brunoferreirasalustiano.github.io/lead-finder-demos/sitemap.xml
```

O sitemap contém a home, quatro páginas institucionais e quatro demonstrações.

## Solicitação inicial de indexação

Usar a ferramenta **Inspeção de URL** e solicitar indexação primeiro para:

1. `https://brunoferreirasalustiano.github.io/lead-finder-demos/`
2. `https://brunoferreirasalustiano.github.io/lead-finder-demos/servicos/`
3. `https://brunoferreirasalustiano.github.io/lead-finder-demos/presenca-digital/`
4. `https://brunoferreirasalustiano.github.io/lead-finder-demos/sobre/`
5. `https://brunoferreirasalustiano.github.io/lead-finder-demos/privacidade/`

As demonstrações podem ser descobertas pelo sitemap e pelos links internos. Solicitações individuais adicionais só devem ser feitas quando houver necessidade, respeitando os limites do Search Console.

## Verificações posteriores

Após o envio:

- confirmar que o sitemap aparece como processado;
- inspecionar a URL canônica escolhida pelo Google;
- acompanhar páginas indexadas e não indexadas;
- verificar consultas, impressões, cliques e posição média;
- corrigir somente problemas confirmados pelos relatórios;
- não interpretar ausência imediata como falha, pois o processamento pode levar dias.

## Migração futura para domínio próprio

Quando houver domínio próprio:

1. adicionar uma nova propriedade do tipo **Domínio**;
2. verificar por registro DNS;
3. configurar o domínio no GitHub Pages ou na hospedagem escolhida;
4. atualizar canonical, sitemap, Open Graph e dados estruturados;
5. manter redirecionamentos permanentes da URL antiga quando possível;
6. enviar o sitemap da nova propriedade;
7. acompanhar a migração no Search Console.

## Referências oficiais

- Verificação de propriedade: https://support.google.com/webmasters/answer/9008080?hl=pt-BR
- Gerenciamento de sitemaps: https://support.google.com/webmasters/answer/7451001?hl=pt-BR
- Inspeção e solicitação de indexação: https://support.google.com/webmasters/answer/9012289?hl=pt-BR
