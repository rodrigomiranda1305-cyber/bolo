import puppeteer from 'puppeteer-core';
import fs from 'fs';import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
// [source, dest name, target width, quality]
const jobs=[
  ['prod-buttercreampro.png','livro-buttercreampro',1200,0.86],
  ['prod-virales.png','livro-receitas-virais',1200,0.86],
  ['prod-nycookies.png','livro-ny-cookies',1200,0.86],
  ['prod-cheesecakes.png','livro-mini-cheesecakes',1200,0.86],
  ['prod-costos.png','planilha-de-custos',1024,0.86],
  ['hero.png','hero',940,0.82],
];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
for(const [src,name,tw,q] of jobs){
  fs.writeFileSync('_r.html','<img id=i src="'+src+'"><canvas id=c></canvas>');
  await p.goto(pathToFileURL(path.resolve('_r.html')).href,{waitUntil:'load'});
  const r=await p.evaluate(async(tw,quality)=>{
    const i=document.getElementById('i');await i.decode();
    const sc=Math.min(1,tw/i.naturalWidth);
    const c=document.getElementById('c');
    c.width=Math.round(i.naturalWidth*sc);c.height=Math.round(i.naturalHeight*sc);
    const x=c.getContext('2d');x.imageSmoothingQuality='high';
    x.drawImage(i,0,0,c.width,c.height);
    return {url:c.toDataURL('image/webp',quality),w:c.width,h:c.height};
  },tw,q);
  const buf=Buffer.from(r.url.split(',')[1],'base64');
  fs.writeFileSync('../assets/img/'+name+'.webp',buf);
  console.log(name.padEnd(24),r.w+'x'+r.h,(buf.length/1024|0)+'KB');
}
await b.close();
