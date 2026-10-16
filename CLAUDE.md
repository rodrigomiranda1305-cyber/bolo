# ButtercreamPro — contexto do site

Funil de venda de materiais digitais de confeitaria. Site estático, sem build,
publicado em **https://buttercream.pro**. O dono é o Rodrigo, brasileiro.
Escreva tudo em português, inclusive comentários de código.

---

## 1. A regra que mais importa

**Toda alteração vai na `/b/`, nunca na raiz.**

A raiz (`index.html`) é só um redirecionador. A página que roda tráfego é
`buttercream.pro/b/`. Se ele pedir "muda no site", é na pasta `b/`.

```
b/index.html      <- a página de vendas de verdade
b/config.js       <- preço, checkout, contadores, pixel (independente da raiz)
b/style-b.css     <- identidade própria, carregado DEPOIS do style.css
b/notificacoes.js <- avisos de compra sorteados
```

A raiz redireciona por JavaScript **preservando a query string**, para não
perder as UTMs da campanha. O `<meta refresh>` é só rede de segurança.

As **imagens são compartilhadas**: a `/b/` aponta para `/assets/img/...` em
caminho absoluto. Mexer numa imagem afeta as duas páginas. Avise quando for o
caso.

---

## 2. Como publicar

GitHub Pages, branch `main`, repositório `rodrigomiranda1305-cyber/bolo`.
Domínio pelo `CNAME`. O `_config.yml` mantém `build/`, o `README.md` e este
arquivo fora do site publicado.

```bash
git add -A && git commit -m "..." && git push origin main
```

**Ele autorizou deploy sem perguntar.** Commite e dê push você mesmo, não peça
confirmação.

O Pages leva de 20 a 90 segundos. **Não confie no commit, confira o que está
no ar:**

```bash
curl -s "https://buttercream.pro/b/?v=$RANDOM" | grep -o 'hero__title">[^<]*'
```

Mensagem de commit: português, sem travessão, explicando o *porquê* e não só o
*o quê*. Olhe o `git log` para pegar o tom.

---

## 3. Como VER o que você mudou

É o que mais economiza tempo aqui. Não entregue mudança visual sem olhar.

**`file://` não funciona** — a página usa caminhos absolutos (`/assets/...`) e
abre sem CSS nenhum. Suba um servidor:

```bash
cd <raiz do repo> && (python -m http.server 8777 >/dev/null 2>&1 &)
# depois: http://localhost:8777/b/index.html
```

Chrome e puppeteer-core já estão instalados:

- Chrome: `C:/Program Files/Google/Chrome/Application/chrome.exe`
- puppeteer: `build/node_modules/puppeteer-core`
- O import ESM **precisa** da forma `file:///C:/...`, senão o Node recusa:
  ```js
  import puppeteer from 'file:///C:/Users/rodri/OneDrive/Documentos/GERENTE DE OPERAÇÃO/01 - BUTTERCREAM PRO/9 - SITE/build/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
  ```

Três pegadinhas que custaram tempo:

- No `page.screenshot({clip})` as coordenadas são **relativas à página**, não à
  janela. Rolar a tela não muda nada; calcule `rect.top + scrollY`.
- Role até o fim e volte ao topo antes de medir, para disparar o lazy-load.
- O mesmo Chrome serve de **editor de imagem**: canvas + `toDataURL`. Foi assim
  que as capas foram redimensionadas, convertidas para WebP/JPG e tiveram fundo
  removido. Veja os exemplos em `build/*.mjs`.

---

## 4. Mapa dos arquivos

```
index.html            redireciona para /b/ preservando query string
b/                    A PÁGINA ATIVA (ver seção 1)
assets/css/style.css  base, herdada da página original (Elementor convertido)
assets/js/app.js      lê o config.js e preenche os data-bp no DOM
assets/img/           imagens, compartilhadas entre raiz e /b/
build/                bastidor, FORA do site publicado
  *.mjs               scripts puppeteer de geração/conversão de imagem
  *-fonte/            originais das imagens
CNAME, _config.yml, robots.txt, sitemap.xml
```

Estrutura do HTML, herdada do Elementor e mantida de propósito:
`.sec` → `.inner` → `.col` → `.w` → `.wc`

O `app.js` preenche os atributos `data-bp` a partir do `config.js`. Os bônus
são genéricos: qualquer chave em `bonusPrices` vira `bonus<Chave>`
automaticamente, não precisa tocar no `app.js` para acrescentar material novo.

**Regra do `style-b.css`:** as seções de fundo escuro (`.sec--hero` `#294670`,
`.sec--offer` e `.sec--final` `#16335b`, `.sec--porque` `#16335b`) só podem
receber **mudança de fonte, nunca de cor**. Já aconteceram três bugs de texto
escuro sobre fundo escuro ali, com contraste de 1.19:1. Se mexer nessas seções,
meça o contraste depois.

---

## 5. A oferta hoje

Conferido em **07/10/2026**.

- **Principal:** ButtercreamPro 3.0 por **R$ 19,90**, ancorado em R$ 199,90.
  Checkout: `https://buttercreampro.pay.yampi.com.br/r/MUZPSBOTKS`
  (fica no `b/config.js`, é o destino único de todos os CTAs).
  **Nunca mexa no preço do principal sem ele pedir.**
- No checkout, fora da página: 2 upsells a R$ 14,90 e 5 order bumps a R$ 9,90.
- Oito materiais na página: ButtercreamPro, Receitas Virais, Cookies
  Americanos, Mini Cheesecakes, Mini Donuts, Bolos Caseiros, Mousses e a
  Planilha de Custos.

**Vocabulário:** chame os materiais de "material exclusivo". **Nunca** use
"ebook" nem "PDF" — ele foi explícito. Também não existe aula, aula gravada,
workshop nem acompanhamento: isso foi todo removido da copy.

Preço, contadores, escassez e pixel ficam **todos** no `b/config.js`. Não
espalhe valor pelo HTML.

---

## 6. Como ele gosta de trabalhar

- **Mude só o que foi pedido.** Já levou bronca por alterar dois blocos quando
  o pedido era um: *"presta atenção é pra mudar so na segunda"*.
- **Nada de travessão (—).** Ele acha feio. Use vírgula, dois-pontos ou ponto.
- **Não peça desculpa, resolva.** *"nao quero desculpas, quero que arrume"*.
  Quando um ajuste de imagem sair ruim, **olhe o resultado** e tente outra
  abordagem antes de entregar.
- **Ele publica junto**, costuma dizer "já sobe direto".
- Ele usa **vários Claudes ao mesmo tempo**. Se algo não bater com o que você
  espera, pode ter sido mexido por fora. Confira antes de concluir.
- Escassez só fica ligada se for real. Tem comentário no `config.js` lembrando
  do art. 37 do CDC. Mantenha esse critério também na copy.
