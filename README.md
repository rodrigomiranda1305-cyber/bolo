# ButtercreamPro — versão brasileira

Réplica visual da landing page `https://buttercreampro.com/skoolbp/`, reconstruída
do zero em HTML/CSS/JS estático e adaptada para português do Brasil.

O original é uma página WordPress + Elementor. Esta versão não usa WordPress: as
medidas foram extraídas do CSS publicado e dos estilos computados da página ao
vivo, e reproduzidas em CSS escrito à mão.

## Como rodar

Qualquer servidor estático serve. Sem build, sem dependências.

```bash
python -m http.server 8000
# abra http://localhost:8000
```

Para publicar, envie a pasta inteira (menos `build/`) para o host.
**Antes de publicar, remova o `<meta name="robots" content="noindex, nofollow">`
do `index.html`** — ele está lá para impedir a indexação do ambiente de testes.

## Estrutura

```
index.html                 markup da página
assets/css/style.css       todo o estilo
assets/js/config.js        preços, checkout, timers, IDs de rastreamento
assets/js/app.js           timers, carrossel, animações, tracking
assets/img/                imagens otimizadas (WebP)
build/                     fontes das imagens + scripts que geraram os slides
```

## Configuração

`assets/js/config.js` é o **único** arquivo a editar para mudar a oferta.
Nenhum preço está fixo no HTML de forma difícil de alterar: os valores no markup
são apenas o texto inicial, e `app.js` reaplica o que estiver na config.

Valores em vigor:

```js
currency: 'R$',
originalPrice: '199,90',
offerPrice: '19,90',
```

Os bônus (R$ 27,99 / R$ 12,99 / R$ 12,99) ficam em `bonusPrices`, no mesmo
arquivo.

O mesmo arquivo define `checkoutUrl`. **Todos os 5 CTAs de compra usam essa única
variável** — não há como um botão apontar para outro lugar por engano. As UTMs da
URL atual (`utm_*`, `gclid`, `fbclid`, `ttclid`) são repassadas ao checkout.

Destino atual, preservado do original:
`https://pay.hotmart.com/U89314700I?off=zbtkndix&checkoutMode=10`

## Contadores

O original usa contadores "evergreen" do Elementor. O comportamento foi
investigado na página ao vivo e replicado exatamente:

| bloco | duração |
|---|---|
| oferta do topo | 480 s (8 min) |
| oferta repetida | 480 s (8 min) |
| "os bônus desaparecerão em" | 1200 s (20 min) |

- A duração é em **segundos**, não minutos (confirmado medindo a página original).
- Cada contador guarda sua data-limite no `localStorage`, nas mesmas chaves do
  original (`<id>-evergreen_due_date` e `<id>-evergreen_interval`).
- **Recarregar a página não reinicia a contagem.** Ela continua de onde estava.
- Quando zera, um novo ciclo começa. Alterar a duração na config também reinicia.

## Rastreamento

`config.js` tem campos vazios para Meta Pixel, GA4 e GTM. **Enquanto o ID estiver
vazio, nenhum script de terceiros é carregado** — então não há risco de evento
duplicado enquanto as contas brasileiras não existem. Basta preencher o ID para
ativar.

Todo clique de compra dispara o evento `bp:checkout_click` no `document` (e
`fbq`/`gtag`/`dataLayer` quando disponíveis), então qualquer ferramenta pode
escutar sem mexer no HTML.

## Imagens

Todas foram convertidas para WebP e redimensionadas para o tamanho de exibição.
Página completa: ~1,5 MB; acima da dobra: ~279 KB.

### Recriadas em português

Os 4 slides do carrossel de conteúdo eram arte com texto em espanhol. Foram
**reconstruídos do zero** mantendo composição, cores, tipografia, fotos e
posições, com o texto em português:

| arquivo | era |
|---|---|
| `slide-cobertura.webp` | "Cobertura mágica" |
| `slide-massas.webp` | "Bizcochos Profesionales" |
| `slide-recheios.webp` | "Rellenos Creativos" |
| `slide-coberturas.webp` | "Coberturas deliciosas" |

As fotos foram recortadas das artes originais; o selo "Butterganache Mágico"
teve a faixa "Mega resistente al calor" trocada por "Mega resistente ao calor"
preservando o grafismo. O fonte editável está em `build/slides.html` — rode
`build/render.mjs` para regerar.

### Depoimentos — agora são 3 cards de texto

Os prints de conversa foram removidos da página e substituídos por três
cards simples em português (citação + nome + cidade), dentro da mesma
seção e sem mexer no resto do layout.

As citações são as das alunas reais, traduzidas do material original, e os
nomes foram mantidos. **A linha de cidade está como marcador
("Cidade / UF")** — preencha com a cidade real de cada aluna antes de
publicar, ou apague o `<span class="depo__local">`. Não preenchi por conta
própria porque inventar a origem de uma pessoa real seria fabricar o
depoimento.

Os prints traduzidos continuam disponíveis em `build/dep-pt-1..5.png`, caso
queira voltar a usá-los.

### Mockups e montagem do topo — traduzidos

| arquivo | títulos trocados |
|---|---|
| `hero.webp` | CREMAS→CREMES, BIZCOCHOS→MASSAS, RELLENOS→RECHEIOS, PLAN DE→PLANO DE (tablet), CERTIFICADO DE REPOSTERA→DE CONFEITEIRA, RECETAS VIRALES→RECEITAS VIRAIS (capa e lombada), COSTOS→CUSTOS, REMOJOS→CALDAS, MINI LIBRO→MINI LIVRO (×2), "Mega resistente al calor"→"ao calor", selo **LIFETIME ACCESS → ACESSO VITALÍCIO** |
| `livro-receitas-virais.webp` | capa, lombada e parágrafo |
| `livro-buttercreampro.webp` | parágrafo de 7 linhas da capa |
| `livro-ny-cookies.webp` | MINI LIBRO → MINI LIVRO |
| `livro-mini-cheesecakes.webp` | MINI LIBRO → MINI LIVRO |
| `planilha-de-custos.webp` | COSTOS → CUSTOS |

Conforme combinado, **as listas miúdas de receitas dentro dos cartões do
topo continuam em espanhol** — saem com cerca de 3 px de altura na tela e
não compensavam o esforço.

Fonte editável: `build/mockups.html` + `build/mockups-data.js`.
Regerar com `node build/render-mk.mjs` e `node build/towebp-mk.mjs`.

**Atenção ao regerar:** os mockups precisam sair com fundo transparente.
Alguns deles ficam por cima de outros blocos por causa de margens negativas
do layout original — com fundo opaco, aparece uma faixa branca tapando o
botão "Comprar agora!". Por isso `mockups.html` usa `background: transparent`,
o screenshot usa `omitBackground: true` e o conversor zera o alfa
quase-transparente antes de codificar o WebP.

## Fidelidade ao original

Comparação lado a lado feita em 1440, 1366, 1280, 1024, 768, 430, 390, 375 e 360 px.

O que foi medido e reproduzido: larguras de container (1140/1024/767),
paddings e gaps por seção, margens negativas dos widgets, tamanhos e pesos de
fonte, line-heights, cores, sombras, raios de borda, alturas dos carrosséis
(418 px e 678 px no desktop; 418 px e 582 px no mobile), itens por slide
(3 desktop / 2 tablet / 1 mobile), geometria dos contadores e ordem das seções.

Duas diferenças conscientes, ambas porque o texto em português é mais longo:

1. **"VALOR REAL (LIVROS DE RECEITAS + BÔNUS)"** — a faixa foi alargada de 68%
   para 80% para a frase caber em uma linha só, como no original. O tamanho da
   fonte é idêntico.
2. **Altura total da página** — 5813 px contra 5793 px do original no desktop
   (+0,3%); no mobile a diferença chega a ~4%, resultado de quebras de linha a
   mais. Nenhuma mudança de layout foi feita por causa disso.

O cabeçalho e o rodapé têm logo e frase institucional no markup mas ocultos por
CSS — **é assim no original** (`.site-logo`/`.site-description { display:none }`),
onde só aparece o aviso de direitos alinhado à direita. Para exibi-los, remova a
classe `is-hidden` no `index.html`.

## Acessibilidade e performance

- `lang="pt-BR"`, charset UTF-8, viewport, title/description/Open Graph em pt-BR.
- Imagens com `width`/`height` declarados — CLS medido: **0,009**.
- Hero com `preload` + `fetchpriority="high"`; todo o resto com `loading="lazy"`.
- Fundos dos carrosséis só baixam quando chegam perto da viewport.
- Sem frameworks nem bibliotecas: ~9 KB de JS próprio. FCP ~420 ms local.
- `prefers-reduced-motion` desliga as animações de entrada e do carrossel.
