import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_h.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_h.html')).href,{waitUntil:'load'});
const f=path.resolve('../assets/img/hero.webp'); const antes=fs.statSync(f).size;
// o hero aparece com 328px no celular: 660 cobre telas 2x com folga
const r=await p.evaluate(async(u)=>{
  const im=document.getElementById('i'); im.src=u; await im.decode();
  const c=document.getElementById('c');
  const sc=660/im.naturalWidth;
  c.width=Math.round(im.naturalWidth*sc); c.height=Math.round(im.naturalHeight*sc);
  const x=c.getContext('2d'); x.imageSmoothingQuality='high';
  x.drawImage(im,0,0,c.width,c.height);
  const d=x.getImageData(0,0,c.width,c.height);
  for(let i=3;i<d.data.length;i+=4) if(d.data[i]<12) d.data[i]=0;
  x.putImageData(d,0,0);
  return {u:c.toDataURL('image/webp',0.80), w:c.width, h:c.height};
}, pathToFileURL(f).href);
const buf=Buffer.from(r.u.split(',')[1],'base64');
fs.writeFileSync('../assets/img/hero-p.webp', buf);
console.log(`  hero-p.webp  ${r.w}x${r.h}  ${(antes/1024|0)}KB -> ${(buf.length/1024|0)}KB`);
await b.close();
