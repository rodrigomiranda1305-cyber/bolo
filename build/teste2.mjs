import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const R='C:/Users/rodri/OneDrive/Documentos/BOLO/Novos depoimentoss';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_t2.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_t2.html')).href,{waitUntil:'load'});
const r=await p.evaluate(async(u)=>{
  const im=document.getElementById('i'); im.src=u; await im.decode();
  const L=560,A=700;
  const c=document.getElementById('c'); c.width=L; c.height=A;
  const x=c.getContext('2d'); x.imageSmoothingQuality='high';
  // 1) fundo: a propria imagem cobrindo tudo, desfocada
  const ec=Math.max(L/im.naturalWidth, A/im.naturalHeight);
  const bw=im.naturalWidth*ec, bh=im.naturalHeight*ec;
  x.filter='blur(26px) brightness(1.06) saturate(.85)';
  x.drawImage(im,(L-bw)/2,(A-bh)/2,bw,bh);
  x.filter='none';
  // 2) frente: a imagem inteira, nitida, centralizada
  const ef=Math.min(L/im.naturalWidth, A/im.naturalHeight);
  const fw=im.naturalWidth*ef, fh=im.naturalHeight*ef;
  x.drawImage(im,(L-fw)/2,(A-fh)/2,fw,fh);
  return c.toDataURL('image/webp',0.82);
}, pathToFileURL(path.join(R,'Nova pasta virais/Antes e Depois do Brownie Gourmet.png')).href);
fs.writeFileSync('t2-brownie.webp', Buffer.from(r.split(',')[1],'base64'));
console.log('  gerado t2-brownie.webp');
await b.close();
