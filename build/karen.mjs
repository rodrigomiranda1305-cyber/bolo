import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_k.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_k.html')).href,{waitUntil:'load'});
const f=path.resolve('karen-fonte/karen-loja.png'); const antes=fs.statSync(f).size;
// duas larguras: a pagina serve a menor no celular
for(const [larg,nome] of [[900,'karen-loja'],[560,'karen-loja-p']]){
  const r=await p.evaluate(async(u,L)=>{
    const im=document.getElementById('i'); im.src=u; await im.decode();
    const c=document.getElementById('c');
    const sc=Math.min(1,L/im.naturalWidth);
    c.width=Math.round(im.naturalWidth*sc); c.height=Math.round(im.naturalHeight*sc);
    const x=c.getContext('2d'); x.imageSmoothingQuality='high';
    x.drawImage(im,0,0,c.width,c.height);
    return {u:c.toDataURL('image/webp',0.80), w:c.width, h:c.height};
  }, pathToFileURL(f).href, larg);
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync(`../assets/img/${nome}.webp`, buf);
  console.log(`  ${nome.padEnd(14)} ${r.w}x${r.h}  ${(antes/1024|0)}KB -> ${(buf.length/1024|0)}KB`);
}
await b.close();
