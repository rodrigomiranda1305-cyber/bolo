import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const R='C:/Users/rodri/OneDrive/Documentos/BOLO/Novos depoimentoss';
const MAPA=[
 ['Nova pasta virais/Antes e Depois do Bolo de Canela.png',        'ad-virais-1'],
 ['Nova pasta virais/Antes e Depois do Brownie Gourmet.png',       'ad-virais-2'],
 ['Nova pasta virais/Antes e Depois_ Torta Cookie Perfeita.png',   'ad-virais-3'],
 ['Cookies americanos/Antes e Depois_ Cookies Recheados.png',      'ad-cookies-1'],
 ['Cookies americanos/Antes e Depois_ Cookies Red Velvet.png',     'ad-cookies-2'],
 ['Cookies americanos/Imagem do ChatGPT 4 de out. de 2026, 19_24_02.png','ad-cookies-3'],
 ['Mini/Antes e Depois do Cheesecake Mini.png',                    'ad-cheese-1'],
 ['Mini/Antes e Depois_ Cheesecakes Perfeitos.png',                'ad-cheese-2'],
 ['Mini/Cheesecakes de Mirtilo_ Antes e Depois.png',               'ad-cheese-3'],
];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_n2.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_n2.html')).href,{waitUntil:'load'});
let tot=0;
for(const [src,nome] of MAPA){
  const r=await p.evaluate(async(u)=>{
    const im=document.getElementById('i'); im.src=u; await im.decode();
    const L=560,A=700;
    const c=document.getElementById('c'); c.width=L; c.height=A;
    const x=c.getContext('2d'); x.imageSmoothingQuality='high';
    const ef=Math.min(L/im.naturalWidth, A/im.naturalHeight);
    const fw=im.naturalWidth*ef, fh=im.naturalHeight*ef;
    const sobra = (fw < L-1) || (fh < A-1);
    if (sobra) {                       // preenche a sobra com o proprio fundo desfocado
      const ec=Math.max(L/im.naturalWidth, A/im.naturalHeight);
      const bw=im.naturalWidth*ec, bh=im.naturalHeight*ec;
      x.filter='blur(26px) brightness(1.06) saturate(.85)';
      x.drawImage(im,(L-bw)/2,(A-bh)/2,bw,bh);
      x.filter='none';
    }
    x.drawImage(im,(L-fw)/2,(A-fh)/2,fw,fh);
    return {u:c.toDataURL('image/webp',0.82),
            orig:`${im.naturalWidth}x${im.naturalHeight}`,
            modo: sobra ? 'sobra preenchida com fundo desfocado' : 'enche o cartao inteiro'};
  }, pathToFileURL(path.join(R,src)).href);
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync(`../assets/img/${nome}.webp`, buf);
  tot+=buf.length;
  console.log(`  ${nome.padEnd(13)} ${r.orig.padEnd(11)} -> 560x700  ${(buf.length/1024|0)}KB  (${r.modo})`);
}
console.log(`\n  total ${(tot/1024).toFixed(0)}KB`);
await b.close();
