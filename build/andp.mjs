import puppeteer from 'puppeteer-core';
import fs from 'fs';import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
/* Aparecem com no maximo ~216px de largura (5 numa linha, faixa de 1140px).
   460px cobre telas 2x com folga. */
const LARGURA=460, Q=0.82;
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
let antesT=0, depoisT=0;
for(let i=1;i<=5;i++){
  const src='antesdepois-fonte/ANDP'+i+'.png';
  const antes=fs.statSync(src).size; antesT+=antes;
  fs.writeFileSync('_ad.html','<img id=i src="'+pathToFileURL(path.resolve(src)).href+'"><canvas id=c></canvas>');
  await p.goto(pathToFileURL(path.resolve('_ad.html')).href,{waitUntil:'load'});
  const r=await p.evaluate(async(tw,q)=>{
    const im=document.getElementById('i');await im.decode();
    const sc=Math.min(1,tw/im.naturalWidth);
    const c=document.getElementById('c');
    c.width=Math.round(im.naturalWidth*sc); c.height=Math.round(im.naturalHeight*sc);
    const x=c.getContext('2d'); x.imageSmoothingQuality='high';
    x.drawImage(im,0,0,c.width,c.height);
    return {u:c.toDataURL('image/webp',q),w:c.width,h:c.height};
  },LARGURA,Q);
  const buf=Buffer.from(r.u.split(',')[1],'base64'); depoisT+=buf.length;
  fs.writeFileSync('../assets/img/antes-depois-'+i+'.webp',buf);
  console.log('antes-depois-'+i+'.webp', r.w+'x'+r.h, (antes/1024|0)+'KB -> '+(buf.length/1024|0)+'KB');
}
console.log('  TOTAL:', (antesT/1024/1024).toFixed(1)+'MB -> '+(depoisT/1024|0)+'KB');
await b.close();
