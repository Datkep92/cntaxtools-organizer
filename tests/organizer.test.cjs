'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../src/core');
const root=path.resolve(__dirname,'..');
test('web and offline HTML are identical, self-contained and restrict network access',()=>{
 const web=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),offline=fs.readFileSync(path.join(root,'dist/CNTaxTools-PhanLoai.html'),'utf8');
 assert.equal(web,offline);assert.ok(web.includes("connect-src 'none'"));assert.ok(web.includes('JSZip'));assert.ok(web.includes('OrganizerApp'));
 assert.doesNotMatch(web,/<script[^>]+src\s*=/i);assert.doesNotMatch(web,/\/\*(?:STYLE|ZIP|CORE|APP)\*\//);
 assert.ok(web.includes('1.8.3'));assert.ok(web.includes('chưa có cầu nối'));
 const sum=require('node:crypto').createHash('sha256').update(web).digest('hex');assert.ok(fs.readFileSync(path.join(root,'dist/SHA256SUMS.txt'),'utf8').startsWith(sum));
});
test('invoice key normalizes invoice number, preserves leading tax ID zeros',()=>{
 assert.equal(C.key({seller:'001234567890',model:'1',series:'C26TAA',number:'00042'}),'001234567890|1|C26TAA|42');
 assert.equal(C.key({seller:'001234567890',model:'1',series:'C26TAA',number:'00000'}),'001234567890|1|C26TAA|0');
});
test('different bytes conflict, identical existing bytes are duplicates',()=>{
 const row={state:'ready',mst:'001234567890',direction:'BUY',key:'key',hash:'new'};
 const map=new Map([[row.mst+'|BUY',new Map([['key',new Set(['old'])]])]]);
 assert.equal(C.conflicts([{...row}],map)[0].state,'conflict');
 assert.equal(C.conflicts([{...row,hash:'old'}],map)[0].state,'duplicate');
 assert.equal(C.conflicts([{...row},{...row,hash:'different'}],new Map())[0].state,'conflict');
});
test('PDF must have header and EOF; unsafe file names are neutralized',()=>{
 assert.equal(C.pdfValid(Buffer.from('%PDF-1.7\nfixture test\n%%EOF')),true);
 assert.equal(C.pdfValid(Buffer.from('<html>not a pdf</html>')),false);
 assert.doesNotMatch(C.safe('../a:b/c?'),/[/:?]/);
});

test('one tax profile across seller/buyer roles and different company names, with distinct invoice counts',()=>{
 const a='001234567890',b='0101234567',rows=[
  {seller:a,sellerName:'Tên A',buyer:b,buyerName:'Tên B',model:'1',series:'C26TAA',number:'01',key:'invoice1'},
  {seller:b,sellerName:'Tên B khác',buyer:a,buyerName:'Tên A khác',model:'1',series:'C26TBB',number:'02',key:'invoice2'}
 ];
 const profiles=C.profilesFrom([...rows,rows[0]]);
 assert.equal(profiles.length,2);assert.equal(profiles.filter(p=>p.mst===a).length,1);
 const owner=profiles.find(p=>p.mst===a);assert.equal(owner.sellCount,1);assert.equal(owner.buyCount,1);
 const result=C.assignments(rows,[owner]);assert.deepEqual(result.map(r=>[r.mst,C.folder(r.direction)]),[[a,'Ban_ra'],[a,'Mua_vao']]);
 assert.ok(result.every(r=>r.state==='ready'));
 const all=C.assignments(rows,profiles);assert.equal(all.length,4);
 assert.equal(all.filter(r=>r.mst===a).length,2);assert.equal(all.filter(r=>r.mst===b).length,2);
 const ambiguous=C.assignments([{...rows[0],buyer:a}],[owner]);assert.equal(ambiguous[0].state,'unmatched');
});

test('new profiles require separate purchase and sales XML; one-sided counterparties and self invoices do not qualify',()=>{
 const rows=[{seller:'001234567890',buyer:'0101234567',key:'sale',sellerName:'A'}, {seller:'0201234567',buyer:'001234567890',key:'purchase',buyerName:'A khác'}];
 const profiles=C.profilesFrom(rows,{requireBoth:true});assert.deepEqual(profiles.map(p=>p.mst),['001234567890']);
 assert.equal(C.profilesFrom([rows[0]],{requireBoth:true}).length,0);
 assert.equal(C.profilesFrom([{seller:'001234567890',buyer:'001234567890',key:'self'}],{requireBoth:true}).length,0);
});
