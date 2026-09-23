import puppeteer from 'puppeteer-core';
import fs from 'fs';import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files','--hide-scrollbars']});
const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',String(e)));
await p.setViewport({width:700,height:1300,deviceScaleFactor:1});
await p.goto(pathToFileURL(path.resolve('testimonials.html')).href,{waitUntil:'networkidle0'});
await p.waitForFunction(()=>document.body.dataset.pronto==='1',{timeout:60000});
await new Promise(r=>setTimeout(r,600));
for(let i=1;i<=5;i++){
  const el=await p.$('#dep'+i);
  await el.screenshot({path:'dep-pt-'+i+'.png'});
  console.log('dep-pt-'+i+'.png');
}
await b.close();
