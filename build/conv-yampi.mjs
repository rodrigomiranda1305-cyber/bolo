import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const IMG='C:/Users/rodri/AppData/Local/Temp/claude/c--Users-rodri-OneDrive-Documentos-BOLO/46426681-c22d-484f-9eb7-f6f0d6541448/images';
const MAPA=[
  ['19.png','principal'],        // Seu acesso ao ButtercreamPro
  ['25.png','calendario'],       // upsell 1
  ['26.png','manual'],           // upsell 2
  ['23.png','precificacao'],     // bump 1
  ['24.png','producao'],         // bump 2
  ['18.png','cardapio'],         // bump 3
  ['20.png','conservacao'],      // bump 4
  ['21.png','fotos'],            // bump 5
  ['27.jpg','depo-fernanda'],
  ['28.jpg','depo-julia'],
  ['29.jpg','depo-fabiana'],
];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_y.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_y.html')).href,{waitUntil:'load'});
let tot=0, totN=0;
for(const [src,nome] of MAPA){
  const f=path.join(IMG,src);
  if(!fs.existsSync(f)){ console.log('  FALTA',src); continue; }
  const antes=fs.statSync(f).size;
  const r=await p.evaluate(async(u)=>{
    const im=document.getElementById('i');
    im.src=u; await im.decode();
    const tw=1200, sc=Math.min(1,tw/im.naturalWidth);
    const c=document.getElementById('c');
    c.width=Math.round(im.naturalWidth*sc); c.height=Math.round(im.naturalHeight*sc);
    const x=c.getContext('2d'); x.imageSmoothingQuality='high';
    x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height);
    x.drawImage(im,0,0,c.width,c.height);
    return {u:c.toDataURL('image/jpeg',0.86), w:c.width, h:c.height};
  }, pathToFileURL(f).href);
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync(`../assets/img/yampi/${nome}.jpg`, buf);
  tot+=antes; totN+=buf.length;
  console.log(`  ${nome.padEnd(14)} ${String(r.w+'x'+r.h).padEnd(10)} ${(antes/1024|0)}KB -> ${(buf.length/1024|0)}KB`);
}
console.log(`\n  TOTAL: ${(tot/1024/1024).toFixed(1)}MB -> ${(totN/1024).toFixed(0)}KB`);
await b.close();
