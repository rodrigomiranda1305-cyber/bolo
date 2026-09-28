import puppeteer from 'puppeteer-core';
import fs from 'fs';import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
// Os slides aparecem com no maximo 371px de largura; 760 cobre telas 2x.
const jobs=[['slide-cobertura',760],['slide-massas',760],['slide-recheios',760],['slide-coberturas',760]];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
const dir='../assets/img/';
for(const [nome,tw] of jobs){
  const antes=fs.statSync(dir+nome+'.webp').size;
  fs.writeFileSync('_m.html','<img id=i src="'+pathToFileURL(path.resolve(dir+nome+'.webp')).href+'"><canvas id=c></canvas>');
  await p.goto(pathToFileURL(path.resolve('_m.html')).href,{waitUntil:'load'});
  const r=await p.evaluate(async(tw)=>{
    const im=document.getElementById('i');await im.decode();
    const sc=Math.min(1,tw/im.naturalWidth);
    const c=document.getElementById('c');
    c.width=Math.round(im.naturalWidth*sc);c.height=Math.round(im.naturalHeight*sc);
    const x=c.getContext('2d');x.imageSmoothingQuality='high';
    x.drawImage(im,0,0,c.width,c.height);
    return {u:c.toDataURL('image/webp',0.84),w:c.width,h:c.height};
  },tw);
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync(dir+nome+'.webp',buf);
  console.log(nome.padEnd(20), r.w+'x'+r.h, (antes/1024|0)+'KB -> '+(buf.length/1024|0)+'KB');
}
await b.close();
