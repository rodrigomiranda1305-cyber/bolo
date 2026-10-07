import puppeteer from 'puppeteer-core';
import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'node:url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const R='C:/Users/rodri/OneDrive/Documentos/BOLO';
const MAPA=[
 ['Mockup Buttercream Pro com Fatia de Bolo.png','livro-buttercreampro'],
 ['Livro de Receitas Virais e Sobremesa.png','livro-receitas-virais'],
 ['Mockup de Livro de Cookies Americanos.png','livro-ny-cookies'],
 ['Mini Livro de Cheesecakes com Frutos Vermelhos.png','livro-mini-cheesecakes'],
];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage();
fs.writeFileSync('_nl.html','<img id=i><canvas id=c></canvas>');
await p.goto(pathToFileURL(path.resolve('_nl.html')).href,{waitUntil:'load'});
let tot=0;
for(const [src,nome] of MAPA){
  const f=path.join(R,src);
  if(!fs.existsSync(f)){ console.log('  FALTA',src); continue; }
  const antes=fs.statSync(f).size;
  const r=await p.evaluate(async(u)=>{
    const im=document.getElementById('i'); im.src=u; await im.decode();
    const c=document.getElementById('c');
    c.width=im.naturalWidth; c.height=im.naturalHeight;
    const x=c.getContext('2d'); x.drawImage(im,0,0);
    const d=x.getImageData(0,0,c.width,c.height), p4=d.data;
    // fundo branco -> transparente, igual as capas atuais.
    // preenchimento por regiao a partir das bordas, para nao furar o miolo claro.
    const vis=new Uint8Array(c.width*c.height); const fila=[];
    const branco=(i)=>p4[i]>242&&p4[i+1]>242&&p4[i+2]>242;
    for(let x0=0;x0<c.width;x0++){ fila.push(x0,0); fila.push(x0,c.height-1); }
    for(let y0=0;y0<c.height;y0++){ fila.push(0,y0); fila.push(c.width-1,y0); }
    while(fila.length){
      const yy=fila.pop(), xx=fila.pop();
      if(xx<0||yy<0||xx>=c.width||yy>=c.height) continue;
      const k=yy*c.width+xx; if(vis[k]) continue;
      const i=k*4; if(!branco(i)) continue;
      vis[k]=1; p4[i+3]=0;
      fila.push(xx+1,yy); fila.push(xx-1,yy); fila.push(xx,yy+1); fila.push(xx,yy-1);
    }
    x.putImageData(d,0,0);
    // reduz para 1200 de largura
    const o=document.createElement('canvas');
    const sc=Math.min(1,1200/c.width);
    o.width=Math.round(c.width*sc); o.height=Math.round(c.height*sc);
    const ox=o.getContext('2d'); ox.imageSmoothingQuality='high';
    ox.drawImage(c,0,0,o.width,o.height);
    const od=ox.getImageData(0,0,o.width,o.height);
    for(let i=3;i<od.data.length;i+=4) if(od.data[i]<12) od.data[i]=0;
    ox.putImageData(od,0,0);
    return {u:o.toDataURL('image/webp',0.86), w:o.width, h:o.height};
  }, pathToFileURL(f).href);
  const buf=Buffer.from(r.u.split(',')[1],'base64');
  fs.writeFileSync(`../assets/img/${nome}.webp`, buf); tot+=buf.length;
  console.log(`  ${nome.padEnd(22)} ${r.w}x${r.h}  ${(antes/1024|0)}KB -> ${(buf.length/1024|0)}KB`);
}
console.log(`\n  total ${(tot/1024).toFixed(0)}KB`);
await b.close();
