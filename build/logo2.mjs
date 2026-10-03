import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_l2.html','<img id=i src="'+pathToFileURL(path.resolve('../assets/img/yampi/logo.png')).href+'"><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_l2.html')).href,{waitUntil:'load'});
const r=await p.evaluate(async()=>{
  const im=document.getElementById('i'); await im.decode();
  // 600x180 = 2x da caixa sugerida (300x90), logo centralizado, fundo transparente
  const c=document.getElementById('c'); c.width=600; c.height=180;
  const x=c.getContext('2d'); x.imageSmoothingQuality='high';
  const esc=Math.min(600/im.naturalWidth, 180/im.naturalHeight)*0.94;
  const w=im.naturalWidth*esc, h=im.naturalHeight*esc;
  x.drawImage(im,(600-w)/2,(180-h)/2,w,h);
  return {u:c.toDataURL('image/png'), w:Math.round(w), h:Math.round(h)};
});
const buf=Buffer.from(r.u.split(',')[1],'base64');
fs.writeFileSync('../assets/img/yampi/logo-checkout.png', buf);
console.log(`logo-checkout.png  600x180 (logo ocupa ${r.w}x${r.h})  ${(buf.length/1024).toFixed(0)}KB  ${buf.length<500*1024?'OK, abaixo de 500KB':'GRANDE DEMAIS'}`);
await b.close();
