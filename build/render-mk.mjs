import puppeteer from 'puppeteer-core';
import fs from 'fs';import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files','--hide-scrollbars']});
const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',String(e)));
p.on('console',m=>{const t=m.text();if(t.startsWith('MODAL'))console.log(t);});
await p.setViewport({width:1960,height:1120});
await p.goto(pathToFileURL(path.resolve('mockups.html')).href,{waitUntil:'networkidle0'});
await p.waitForFunction(()=>document.body.dataset.pronto==='1',{timeout:240000});
await new Promise(r=>setTimeout(r,500));
const specs=await p.evaluate(()=>window.MOCKUPS.map(m=>({out:m.out,largura:m.largura,w:m.w,h:m.h})));
for(let i=0;i<specs.length;i++){
  const el=await p.$('#mk'+i);
  await el.screenshot({path:'mk-pt-'+i+'.png',omitBackground:true});
  console.log('mk-pt-'+i+'.png',specs[i].out);
}
await b.close();
