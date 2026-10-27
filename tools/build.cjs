'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'src'),out=path.join(root,'dist');
let html=fs.readFileSync(path.join(dir,'page.html'),'utf8');
for(const [slot,file] of [['STYLE',path.join(dir,'style.css')],['ZIP',require.resolve('jszip/dist/jszip.min.js')],['CORE',path.join(dir,'core.js')],['BRIDGE',path.join(dir,'bridge.js')],['APP',path.join(dir,'app.js')]]) {
 const text=fs.readFileSync(file,'utf8').replace(/<\/script/gi,'<\\/script');
 html=html.replace('/*'+slot+'*/',()=>text);
}
fs.mkdirSync(out,{recursive:true});
html=html.replace(/\r\n/g,'\n');
const sums=[];
for(const mode of ['sort','pdf']){
 const title=mode==='pdf'?'Tải PDF hóa đơn gốc':'Phân loại hóa đơn XML / ZIP';
 const description=mode==='pdf'?'Chọn XML, chọn nơi lưu và tải ngay. Không cần phân loại hoặc chọn hồ sơ MST.':'Sắp xếp XML/ZIP theo MST mua vào, bán ra. Giữ nguyên tệp nguồn.';
 const offline=mode==='pdf'?'CNTaxTools-TaiPDF.html':'CNTaxTools-PhanLoai.html';
 let page=html.replaceAll('/*MODE*/',mode).replaceAll('/*TITLE*/',title).replaceAll('/*DESCRIPTION*/',description).replaceAll('/*OFFLINE*/',offline);
 const web=page.replaceAll('/*SORT_URL*/',mode==='pdf'?'../':'./').replaceAll('/*PDF_URL*/',mode==='pdf'?'./':'tai-pdf/');
 const directory=mode==='pdf'?path.join(out,'tai-pdf'):out;fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'index.html'),web);
 page=page.replaceAll('/*SORT_URL*/','CNTaxTools-PhanLoai.html').replaceAll('/*PDF_URL*/','CNTaxTools-TaiPDF.html');
 fs.writeFileSync(path.join(out,offline),page);if(mode==='pdf')fs.writeFileSync(path.join(directory,offline),page);
 sums.push(crypto.createHash('sha256').update(page).digest('hex')+'  '+offline);
}
fs.copyFileSync(path.join(root,'HUONG-DAN.md'),path.join(out,'HUONG-DAN.md'));
fs.copyFileSync(path.join(root,'THIRD_PARTY_NOTICES.md'),path.join(out,'THIRD_PARTY_NOTICES.md'));
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(out,'SHA256SUMS.txt'),sums.join('\n')+'\n');
console.log('Built static website + offline HTML in dist/');
