import puppeteer from 'puppeteer-core';
import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
await p.setViewport({width:1080,height:1350,deviceScaleFactor:1});
await p.goto(pathToFileURL(path.resolve('slides.html')).href,{waitUntil:'networkidle0'});
await p.evaluate(()=>document.fonts.ready);
await new Promise(r=>setTimeout(r,800));
const names={s1:'slide-cobertura',s2:'slide-massas',s3:'slide-recheios',s4:'slide-coberturas'};
for(const id of Object.keys(names)){
  const el=await p.$('#'+id);
  await el.screenshot({path:'../assets/img/'+names[id]+'.png'});
  console.log(names[id]);
}
await b.close();
