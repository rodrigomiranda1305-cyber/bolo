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
const L=560, A=700;   // todas saem exatamente 560x700 (4:5)
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_m.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_m.html')).href,{waitUntil:'load'});
let tot=0;
for(const [src,nome] of MAPA){
  const f=path.join(R,src);
  const r=await p.evaluate(async(u,L,A)=>{
    const im=document.getElementById('i'); im.src=u; await im.decode();
    const c=document.getElementById('c'); c.width=L; c.height=A;
    const x=c.getContext('2d'); x.imageSmoothingQuality='high';
    x.fillStyle='#fff'; x.fillRect(0,0,L,A);
    const prop=im.naturalWidth/im.naturalHeight, alvo=L/A;
    let modo;
    if (Math.abs(prop-alvo) < 0.03) {              // ja esta na proporcao
      x.drawImage(im,0,0,L,A); modo='exata';
    } else if (prop < alvo) {                       // mais ALTA: corta por cima
      const w=L, h=L/prop;                          // o rodape com as tarjas fica
      x.drawImage(im,0,A-h,w,h); modo='corte no topo';
    } else {                                        // mais LARGA: sobra branca
      const w=L, h=L/prop;
      x.drawImage(im,0,(A-h)/2,w,h); modo='centrada, margem branca';
    }
    return {u:c.toDataURL('image/webp',0.82), modo, orig:`${im.naturalWidth}x${im.naturalHeight}`};
  }, pathToFileURL(f).href, L, A);
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync(`../assets/img/${nome}.webp`, buf);
  tot+=buf.length;
  console.log(`  ${nome.padEnd(13)} ${r.orig.padEnd(11)} -> ${L}x${A}  ${(buf.length/1024|0)}KB  (${r.modo})`);
}
console.log(`\n  todas em ${L}x${A}  |  total ${(tot/1024).toFixed(0)}KB`);
await b.close();
