import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_l.html','<img id=i src="'+pathToFileURL(path.resolve('../assets/img/logo.webp')).href+'"><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_l.html')).href,{waitUntil:'load'});
const r=await p.evaluate(async()=>{
  const im=document.getElementById('i'); await im.decode();
  const c=document.getElementById('c'); const x=c.getContext('2d');
  c.width=im.naturalWidth; c.height=im.naturalHeight;
  x.drawImage(im,0,0);
  // acha os limites do que nao e transparente, para recortar a sobra
  const d=x.getImageData(0,0,c.width,c.height).data;
  let x0=c.width,y0=c.height,x1=0,y1=0;
  for(let y=0;y<c.height;y++)for(let w=0;w<c.width;w++){
    if(d[(y*c.width+w)*4+3]>12){ if(w<x0)x0=w; if(w>x1)x1=w; if(y<y0)y0=y; if(y>y1)y1=y; }
  }
  const m=8, cw=x1-x0+1+m*2, ch=y1-y0+1+m*2;
  const o=document.createElement('canvas'); o.width=cw; o.height=ch;
  o.getContext('2d').drawImage(c,x0-m,y0-m,cw,ch,0,0,cw,ch);
  return {u:o.toDataURL('image/png'), w:cw, h:ch, orig:`${c.width}x${c.height}`};
});
const buf=Buffer.from(r.u.split(',')[1],'base64');
fs.writeFileSync('../assets/img/yampi/logo.png', buf);
console.log(`logo.png  ${r.orig} -> ${r.w}x${r.h}  ${(buf.length/1024|0)}KB (fundo transparente)`);
await b.close();
