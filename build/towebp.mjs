import puppeteer from 'puppeteer-core';
import fs from 'fs';import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
// [source, destination(basename in assets/img), quality]
const jobs=[
  ['hero.png','hero',0.9],
  ['prod-buttercreampro.png','livro-buttercreampro',0.88],
  ['prod-virales.png','livro-receitas-virais',0.88],
  ['prod-nycookies.png','livro-ny-cookies',0.88],
  ['prod-cheesecakes.png','livro-mini-cheesecakes',0.88],
  ['prod-costos.png','planilha-de-custos',0.88],
  ['car2-1.png','depoimento-1',0.86],
  ['car2-2.png','depoimento-2',0.86],
  ['car2-3.png','depoimento-3',0.86],
  ['car2-4.png','depoimento-4',0.86],
  ['car2-5.png','depoimento-5',0.86],
  ['../assets/img/slide-cobertura.png','slide-cobertura',0.9],
  ['../assets/img/slide-massas.png','slide-massas',0.9],
  ['../assets/img/slide-recheios.png','slide-recheios',0.9],
  ['../assets/img/slide-coberturas.png','slide-coberturas',0.9],
];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
for(const [src,name,q] of jobs){
  fs.writeFileSync('_c.html','<img id=i src="'+src+'"><canvas id=c></canvas>');
  await p.goto(pathToFileURL(path.resolve('_c.html')).href,{waitUntil:'load'});
  const r=await p.evaluate(async(quality)=>{
    const i=document.getElementById('i');await i.decode();
    const c=document.getElementById('c');c.width=i.naturalWidth;c.height=i.naturalHeight;
    const x=c.getContext('2d');x.drawImage(i,0,0);
    return {url:c.toDataURL('image/webp',quality),w:c.width,h:c.height};
  },q);
  const buf=Buffer.from(r.url.split(',')[1],'base64');
  fs.writeFileSync('../assets/img/'+name+'.webp',buf);
  const before=fs.statSync(src).size;
  console.log(name.padEnd(24),r.w+'x'+r.h,(before/1024|0)+'KB -> '+(buf.length/1024|0)+'KB');
}
await b.close();
