import puppeteer from 'puppeteer-core';
import fs from 'fs';import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
for(let i=1;i<=5;i++){
  fs.writeFileSync('_w.html','<img id=i src="dep-pt-'+i+'.png"><canvas id=c></canvas>');
  await p.goto(pathToFileURL(path.resolve('_w.html')).href,{waitUntil:'load'});
  const r=await p.evaluate(async()=>{
    const im=document.getElementById('i');await im.decode();
    const c=document.getElementById('c');c.width=im.naturalWidth;c.height=im.naturalHeight;
    c.getContext('2d').drawImage(im,0,0);
    return {u:c.toDataURL('image/webp',0.86),w:c.width,h:c.height};
  });
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync('../assets/img/depoimento-'+i+'.webp',buf);
  console.log('depoimento-'+i+'.webp',r.w+'x'+r.h,(buf.length/1024|0)+'KB');
}
await b.close();
