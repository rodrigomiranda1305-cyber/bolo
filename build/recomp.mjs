import puppeteer from 'puppeteer-core';
import fs from 'fs';import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir='../assets/img/';
const jobs=[['hero',940,0.78],['depoimento-1',620,0.80],['depoimento-2',620,0.80],
            ['depoimento-3',620,0.80],['depoimento-4',620,0.80],['depoimento-5',620,0.80]];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();let antesT=0,depoisT=0;
for(const [nome,tw,q] of jobs){
  const antes=fs.statSync(dir+nome+'.webp').size; antesT+=antes;
  fs.writeFileSync('_rc.html','<img id=i src="'+pathToFileURL(path.resolve(dir+nome+'.webp')).href+'"><canvas id=c></canvas>');
  await p.goto(pathToFileURL(path.resolve('_rc.html')).href,{waitUntil:'load'});
  const r=await p.evaluate(async(tw,q)=>{
    const im=document.getElementById('i');await im.decode();
    const sc=Math.min(1,tw/im.naturalWidth);
    const c=document.getElementById('c');
    c.width=Math.round(im.naturalWidth*sc);c.height=Math.round(im.naturalHeight*sc);
    const x=c.getContext('2d');x.imageSmoothingQuality='high';x.clearRect(0,0,c.width,c.height);
    x.drawImage(im,0,0,c.width,c.height);
    const g=x.getImageData(0,0,c.width,c.height);
    for(let k=3;k<g.data.length;k+=4) if(g.data[k]<12) g.data[k]=0;
    x.putImageData(g,0,0);
    return {u:c.toDataURL('image/webp',q),w:c.width,h:c.height};
  },tw,q);
  const buf=Buffer.from(r.u.split(',')[1],'base64'); depoisT+=buf.length;
  fs.writeFileSync(dir+nome+'.webp',buf);
  console.log(nome.padEnd(16), r.w+'x'+r.h, (antes/1024|0)+'KB -> '+(buf.length/1024|0)+'KB');
}
console.log('  total:', (antesT/1024|0)+'KB -> '+(depoisT/1024|0)+'KB');
await b.close();
