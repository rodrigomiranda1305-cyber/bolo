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
fs.writeFileSync('_n.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_n.html')).href,{waitUntil:'load'});
let a=0,d=0;
for(const [src,nome] of MAPA){
  const f=path.join(R,src);
  if(!fs.existsSync(f)){ console.log('  FALTA', src); continue; }
  const antes=fs.statSync(f).size;
  const r=await p.evaluate(async(u)=>{
    const im=document.getElementById('i'); im.src=u; await im.decode();
    const tw=560, sc=Math.min(1,tw/im.naturalWidth);
    const c=document.getElementById('c');
    c.width=Math.round(im.naturalWidth*sc); c.height=Math.round(im.naturalHeight*sc);
    const x=c.getContext('2d'); x.imageSmoothingQuality='high';
    x.drawImage(im,0,0,c.width,c.height);
    return {u:c.toDataURL('image/webp',0.80), w:c.width, h:c.height};
  }, pathToFileURL(f).href);
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync(`../assets/img/${nome}.webp`, buf);
  a+=antes; d+=buf.length;
  console.log(`  ${nome.padEnd(14)} ${r.w}x${r.h}  ${(antes/1024|0)}KB -> ${(buf.length/1024|0)}KB`);
}
console.log(`\n  TOTAL: ${(a/1024/1024).toFixed(1)}MB -> ${(d/1024).toFixed(0)}KB`);
await b.close();
