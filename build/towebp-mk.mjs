import puppeteer from 'puppeteer-core';
import fs from 'fs';import path from 'path';import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
// [origem, destino, largura alvo, qualidade]
// O alfa quase-transparente é zerado antes de codificar: sem isso o WebP
// com perdas deixa alfa 1 em vez de 0 e aparece um retângulo acinzentado.
const jobs=[['mk-pt-0.png','livro-buttercreampro',1200,0.86],['mk-pt-1.png','livro-receitas-virais',1200,0.86],
            ['mk-pt-2.png','livro-ny-cookies',1200,0.86],['mk-pt-3.png','livro-mini-cheesecakes',1200,0.86],
            ['mk-pt-4.png','planilha-de-custos',1024,0.86],
            ['mk-pt-5.png','hero',940,0.86]];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
for(const [src,name,tw,q] of jobs){
  fs.writeFileSync('_tw.html','<img id=i src="'+src+'"><canvas id=c></canvas>');
  await p.goto(pathToFileURL(path.resolve('_tw.html')).href,{waitUntil:'load'});
  const r=await p.evaluate(async(tw,q)=>{
    const im=document.getElementById('i');await im.decode();
    const sc=Math.min(1,tw/im.naturalWidth);
    const c=document.getElementById('c');
    c.width=Math.round(im.naturalWidth*sc);c.height=Math.round(im.naturalHeight*sc);
    const x=c.getContext('2d');x.imageSmoothingQuality='high';x.clearRect(0,0,c.width,c.height);
    x.drawImage(im,0,0,c.width,c.height);
    /* zera o alfa quase-transparente antes de codificar */
    const g=x.getImageData(0,0,c.width,c.height);
    for(let k=3;k<g.data.length;k+=4) if(g.data[k]<12) g.data[k]=0;
    x.putImageData(g,0,0);
    return {u:c.toDataURL('image/webp',q),w:c.width,h:c.height};
  },tw,q);
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync('../assets/img/'+name+'.webp',buf);
  console.log(name.padEnd(24),r.w+'x'+r.h,(buf.length/1024|0)+'KB');
}
await b.close();
