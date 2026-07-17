# Lead Finder Brasil — Landing Pages Demonstrativas

Catálogo estático e responsivo com quatro demonstrações comerciais:

- Barbearia e salão de beleza
- Oficina mecânica e auto center
- Restaurante, pizzaria ou lanchonete
- Prestadores de serviços locais

## Objetivo

Apoiar o piloto interno da Lead Finder Brasil com experiências visuais que possam ser enviadas somente após autorização do potencial cliente.

## Direção visual

A interface utiliza uma linguagem de landing page moderna, expressiva e original:

- tipografia grande e amigável;
- formas orgânicas e composições assimétricas;
- cores fortes por segmento;
- cards, faixas em movimento e mockups construídos em CSS;
- animações progressivas e interações leves em JavaScript;
- experiência responsiva e acessível.

A direção foi inspirada em tendências contemporâneas de sites SaaS e produtos digitais, sem copiar código, conteúdo, imagens, marcas ou ativos de terceiros.

## Princípios

- nenhuma empresa real é representada;
- nomes, preços e endereços são fictícios;
- sem rastreamento, cookies ou coleta de dados;
- sem integração real com WhatsApp;
- botões comerciais são apenas demonstrativos;
- páginas responsivas e sem dependências externas;
- suporte a navegação por teclado e `prefers-reduced-motion`.

## Estrutura

```text
lead-finder-demos/
├── index.html
├── barbearia/
├── oficina/
├── restaurante/
├── prestador-servicos/
├── assets/
└── README.md
```

## Recursos de interface

- navegação flutuante e responsiva;
- barra de progresso de leitura;
- revelação progressiva com `IntersectionObserver`;
- cards com movimento sutil em dispositivos compatíveis;
- contadores animados;
- FAQ em accordion;
- cardápio com tabs acessíveis;
- CTAs demonstrativos com aviso em toast;
- fechamento do menu por `Escape` e clique externo.

## Execução local

Abra `index.html` diretamente no navegador ou use um servidor estático:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Publicação no GitHub Pages

O projeto está preparado para publicação direta a partir da branch `main`, na raiz do repositório. No GitHub, acesse **Settings → Pages**, selecione **Deploy from a branch**, escolha `main` e `/ (root)`.

## Contato

Lead Finder Brasil  
Prospecção, sites e soluções digitais para seu negócio.  
`leadfinderbrasil@gmail.com`
