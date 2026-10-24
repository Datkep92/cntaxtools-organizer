'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'src'),out=path.join(root,'dist');
let html=fs.readFileSync(path.join(dir,'page.html'),'utf8');
for(const [slot,file] of [['STYLE',path.join(dir,'style.css')],['ZIP',require.resolve('jszip/dist/jszip.min.js')],['CORE',path.join(dir,'core.js')],['APP',path.join(dir,'app.js')]]) {
 const text=fs.readFileSync(file,'utf8').replace(/<\/script/gi,'<\\/script');
 html=html.replace('/*'+slot+'*/',()=>text);
}
fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','CNTaxTools-PhanLoai.html'])fs.writeFileSync(path.join(out,name),html);
fs.copyFileSync(path.join(root,'HUONG-DAN.md'),path.join(out,'HUONG-DAN.md'));
fs.copyFileSync(path.join(root,'THIRD_PARTY_NOTICES.md'),path.join(out,'THIRD_PARTY_NOTICES.md'));
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(out,'SHA256SUMS.txt'),crypto.createHash('sha256').update(html).digest('hex')+'  CNTaxTools-PhanLoai.html\n');
console.log('Built static website + offline HTML in dist/');
