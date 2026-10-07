import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_w.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_w.html')).href,{waitUntil:'load'});
let tot=0;
for(const n of ['livro-mini-donuts','livro-bolos-caseiros','livro-mousses']){
  const f=path.resolve(`_${n}.png`); const antes=fs.statSync(f).size;
  const r=await p.evaluate(async(u)=>{
    const im=document.getElementById('i'); im.src=u; await im.decode();
    const tw=1200, sc=Math.min(1,tw/im.naturalWidth);
    const c=document.getElementById('c');
    c.width=Math.round(im.naturalWidth*sc); c.height=Math.round(im.naturalHeight*sc);
    const x=c.getContext('2d'); x.imageSmoothingQuality='high';
    x.drawImage(im,0,0,c.width,c.height);
    // alfa quase zero vira zero: senao o webp com perda deixa um quadrado cinza
    const d=x.getImageData(0,0,c.width,c.height);
    for(let i=3;i<d.data.length;i+=4) if(d.data[i]<12) d.data[i]=0;
    x.putImageData(d,0,0);
    return {u:c.toDataURL('image/webp',0.88), w:c.width, h:c.height};
  }, pathToFileURL(f).href);
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync(`../assets/img/${n}.webp`, buf); tot+=buf.length;
  console.log(`  ${n.padEnd(22)} ${r.w}x${r.h}  ${(antes/1024|0)}KB -> ${(buf.length/1024|0)}KB`);
}
console.log(`\n  total ${(tot/1024).toFixed(0)}KB`);
await b.close();
