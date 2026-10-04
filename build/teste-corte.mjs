import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const R='C:/Users/rodri/OneDrive/Documentos/BOLO/Novos depoimentoss';
const LARGAS=[
 ['Nova pasta virais/Antes e Depois do Brownie Gourmet.png',     't-brownie'],
 ['Nova pasta virais/Antes e Depois_ Torta Cookie Perfeita.png', 't-torta'],
 ['Mini/Antes e Depois do Cheesecake Mini.png',                  't-cheese'],
];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_t.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_t.html')).href,{waitUntil:'load'});
for(const [src,nome] of LARGAS){
  const r=await p.evaluate(async(u)=>{
    const im=document.getElementById('i'); im.src=u; await im.decode();
    const L=560,A=700;
    const c=document.getElementById('c'); c.width=L; c.height=A;
    const x=c.getContext('2d'); x.imageSmoothingQuality='high';
    // cover: enche a altura e corta a largura pelo centro
    const esc=A/im.naturalHeight, w=im.naturalWidth*esc;
    x.drawImage(im,(L-w)/2,0,w,A);
    return {u:c.toDataURL('image/webp',0.82),
            cortado:Math.round((1-L/w)*100)+'% da largura'};
  }, pathToFileURL(path.join(R,src)).href);
  fs.writeFileSync(`${nome}.webp`, Buffer.from(r.u.split(',')[1],'base64'));
  console.log(`  ${nome}: corta ${r.cortado}`);
}
await b.close();
