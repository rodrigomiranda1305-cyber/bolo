import puppeteer from 'puppeteer-core';
import fs from 'fs';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';

const LIVROS=[
 {saida:'livro-mini-donuts', titulo:'MINI LIVRO', sub:'DONUTS',
  c1:'#8d3b5e', c2:'#5d2340', detalhe:'Massa, recheio e cobertura'},
 {saida:'livro-bolos-caseiros', titulo:'MINI LIVRO', sub:'BOLOS CASEIROS',
  c1:'#a8652b', c2:'#6d3c14', detalhe:'Laranja, fubá, cenoura e mais'},
 {saida:'livro-mousses', titulo:'MINI LIVRO', sub:'MOUSSES',
  c1:'#4a5a8c', c2:'#2a3356', detalhe:'Aeradas, firmes e estáveis'},
];

const html = (L) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;background:transparent}
  .palco{width:660px;height:600px;display:grid;place-items:center;perspective:1700px}
  .livro{position:relative;transform:rotateY(-21deg) rotateX(2deg);transform-style:preserve-3d}
  .capa{width:290px;height:400px;border-radius:3px 7px 7px 3px;
    background:linear-gradient(145deg,${L.c1} 0%,${L.c2} 100%);
    box-shadow:inset -22px 0 26px -22px rgba(0,0,0,.55), inset 2px 0 0 rgba(255,255,255,.22);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:30px 26px;box-sizing:border-box;text-align:center;color:#fff;position:relative}
  /* moldura dourada fina, igual ao acabamento das outras capas */
  .capa::after{content:"";position:absolute;inset:14px;border:1px solid rgba(232,200,122,.5);border-radius:3px}
  .marca{font:600 10px/1 Inter,sans-serif;letter-spacing:.3em;color:#e8c87a;margin-bottom:auto;padding-top:6px}
  .tit{font:600 13px/1 Inter,sans-serif;letter-spacing:.3em;opacity:.85}
  .sub{font:700 ${L.sub.length>10?30:40}px/1.05 "Playfair Display",Georgia,serif;margin:9px 0 12px;letter-spacing:-.01em}
  .risco{width:48px;height:2px;background:#e8c87a;margin:0 0 12px}
  .det{font:400 11.5px/1.45 Inter,sans-serif;opacity:.82;max-width:200px}
  .rodape{margin-top:auto;font:600 9.5px/1 Inter,sans-serif;letter-spacing:.22em;opacity:.6;padding-bottom:4px}
  /* lombada: o livro tem espessura */
  .lombada{position:absolute;left:-26px;top:0;width:26px;height:400px;
    background:linear-gradient(90deg,#cfcfcf,#f4f4f4 38%,#e2e2e2);
    transform:rotateY(90deg);transform-origin:right center;border-radius:3px 0 0 3px}
  /* sombra projetada no chao */
  .sombra{position:absolute;left:-62px;bottom:-26px;width:420px;height:54px;
    background:radial-gradient(ellipse at center,rgba(30,34,52,.55),transparent 66%);
    filter:blur(11px);transform:rotateX(76deg)}
</style></head><body>
<div class="palco"><div class="livro">
  <div class="sombra"></div><div class="lombada"></div>
  <div class="capa">
    <div class="marca">BUTTERCREAM PRO</div>
    <div class="tit">${L.titulo}</div>
    <div class="sub">${L.sub}</div>
    <div class="risco"></div>
    <div class="det">${L.detalhe}</div>
    <div class="rodape">BÔNUS EXCLUSIVO</div>
  </div>
</div></div></body></html>`;

const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:660,height:600,deviceScaleFactor:2});
for(const L of LIVROS){
  await p.setContent(html(L),{waitUntil:'domcontentloaded'});
  await p.evaluate(()=>document.fonts.ready);
  await new Promise(r=>setTimeout(r,500));
  const el=await p.$('.palco');
  const png=await el.screenshot({omitBackground:true});
  fs.writeFileSync(`_${L.saida}.png`, png);
  console.log(`  ${L.saida}.png gerado (${(png.length/1024|0)}KB)`);
}
await b.close();
