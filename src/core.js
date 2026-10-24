(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.InvoiceOrganizer=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const limits={xml:16*1024*1024,zip:128*1024*1024,expanded:512*1024*1024,entries:20000,nesting:3};
 const safe=s=>String(s).replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').replace(/[. ]+$/,'').slice(0,100);
 const number=s=>/^\d+$/.test(s)?s.replace(/^0+(?=\d)/,''):s;
 const key=r=>[r.seller,r.model,r.series,number(r.number)].join('|');
 const decode=bytes=>new TextDecoder(bytes[0]===255&&bytes[1]===254||bytes[0]===60&&bytes[1]===0?'utf-16le':bytes[0]===254&&bytes[1]===255||bytes[0]===0&&bytes[1]===60?'utf-16be':'utf-8',{fatal:true}).decode(bytes);
 async function hash(bytes){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
 function parse(bytes){
  if(bytes.length>limits.xml)throw Error('XML vượt giới hạn 16 MB.');const text=decode(bytes);
  if(/<!DOCTYPE|<!ENTITY/i.test(text))throw Error('Không nhận XML có khai báo DTD/entity.');
  const doc=new DOMParser().parseFromString(text,'application/xml');if(doc.getElementsByTagName('parsererror').length)throw Error('XML không hợp lệ.');
  const first=(el,name)=>[...el.getElementsByTagName('*')].find(n=>n.localName===name),value=(el,name)=>el?(first(el,name)?.textContent||'').trim():'';
  const invoices=[...doc.getElementsByTagName('*')].filter(e=>e.localName==='HDon');if(invoices.length!==1)throw Error(invoices.length?'XML chứa nhiều hóa đơn; cần tách riêng trước.':'XML không phải hóa đơn HDon.');const invoice=invoices[0];
  const data=first(invoice,'DLHDon'),common=data&&first(data,'TTChung'),seller=data&&first(data,'NBan'),buyer=data&&first(data,'NMua');
  if(!data||!common||!seller)throw Error('Thiếu cấu trúc hóa đơn.');
  const row={seller:value(seller,'MST'),sellerName:value(seller,'Ten'),buyer:value(buyer,'MST'),buyerName:value(buyer,'Ten')||value(buyer,'HVTNMHang'),model:value(common,'KHMSHDon'),series:value(common,'KHHDon'),number:value(common,'SHDon')};
  if([row.seller,row.model,row.series,row.number].some(x=>!x||x.includes('|')||x.length>100))throw Error('Thiếu hoặc sai MST người bán, mẫu số, ký hiệu hoặc số hóa đơn.');
  row.key=key(row);return row;
 }
 async function snapshot(dir,prefix='',out=[],depth=0,stopped=()=>false,skipReview=false){
  if(depth>64)throw Error('Thư mục lồng quá 64 cấp: '+prefix);
  for await(const [name,entry]of dir.entries()){if(stopped())throw Error('Đã dừng tìm tệp.');if(entry.kind==='directory'){if(skipReview&&name==='_Phan_loai_can_kiem_tra')continue;await snapshot(entry,prefix+name+'/',out,depth+1,stopped,skipReview);}else if(/\.(xml|zip)$/i.test(name))out.push({name:prefix+name,file:()=>entry.getFile()});}
  return out;
 }
 // Read declared sizes BEFORE JSZip inflates; count expanded bytes across nested archives.
 function zipInventory(bytes,budget){
  const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);let end=-1;
  for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(v.getUint32(i,true)===0x06054b50){end=i;break;}
  if(end<0)throw Error('ZIP không hợp lệ.');if(v.getUint16(end+4,true)||v.getUint16(end+6,true))throw Error('Không hỗ trợ ZIP nhiều phần.');
  const count=v.getUint16(end+10,true);let at=v.getUint32(end+16,true),total=0;if(count===65535||at===0xffffffff)throw Error('Chưa hỗ trợ ZIP64.');
  budget.entries+=count;if(budget.entries>limits.entries)throw Error('Vượt 20.000 mục trong ZIP của lượt quét.');
  for(let i=0;i<count;i++){if(at+46>bytes.length||v.getUint32(at,true)!==0x02014b50)throw Error('Danh mục ZIP bị hỏng.');if(v.getUint16(at+8,true)&1)throw Error('ZIP có mật khẩu.');const n=v.getUint32(at+24,true);if(n===0xffffffff)throw Error('Chưa hỗ trợ ZIP64.');total+=n;at+=46+v.getUint16(at+28,true)+v.getUint16(at+30,true)+v.getUint16(at+32,true);}
  budget.expanded+=total;if(budget.expanded>limits.expanded)throw Error('Vượt giới hạn giải nén 512 MB trong lượt quét.');
 }
 async function collect(sources,{zip,onIssue=()=>{},onProgress=()=>{},stopped=()=>false}={}){
  const rows=[],budget={expanded:0,entries:0,xml:0};
  const inflate=e=>new Promise((resolve,reject)=>{let size=0,parts=[],failed=false;const max=/\.xml$/i.test(e.name)?limits.xml:limits.zip,stream=e.internalStream('uint8array');stream.on('data',b=>{if(failed)return;size+=b.length;if(stopped()||size>max){failed=true;parts=[];stream.pause();reject(Error(stopped()?'Đã dừng.':'Tệp trong ZIP vượt giới hạn dung lượng.'));return;}parts.push(b);}).on('error',reject).on('end',()=>{if(failed)return;const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}resolve(bytes);}).resume();});
  async function read(name,bytes,depth){if(stopped())throw Error('Đã dừng.');
   if(/\.xml$/i.test(name)){budget.xml+=bytes.length;if(budget.xml>limits.expanded)throw Error('Tổng XML vượt 512 MB; chia nhỏ nguồn.');const r=parse(bytes);rows.push({...r,name,bytes,hash:await hash(bytes)});return;}
   if(!/\.zip$/i.test(name))return;if(bytes.length>limits.zip)throw Error('ZIP vượt 128 MB.');if(depth>=limits.nesting)throw Error('ZIP lồng quá 3 lớp.');zipInventory(bytes,budget);
   const archive=await zip.loadAsync(bytes);for(const e of Object.values(archive.files)){if(stopped())throw Error('Đã dừng.');if(e.dir||! /\.(xml|zip)$/i.test(e.name))continue;
    try{const data=await inflate(e);await read(name+' › '+e.name,data,depth+1);}catch(err){if(stopped())throw err;onIssue(name+' › '+e.name,err.message);}}
  }
  for(let i=0;i<sources.length;i++){if(stopped())break;const s=sources[i];try{const f=await s.file();if(f.size>(/\.zip$/i.test(s.name)?limits.zip:limits.xml))throw Error('Tệp vượt giới hạn dung lượng.');await read(s.name,new Uint8Array(await f.arrayBuffer()),0);}catch(e){if(stopped())break;onIssue(s.name,e.message);}onProgress(i+1,sources.length);}
  return rows;
 }
 function profilesFrom(rows,{requireBoth=false}={}){const found=new Map();for(const r of rows)for(const [code,name,role]of [[r.seller,r.sellerName,'SELL'],[r.buyer,r.buyerName,'BUY']]){if(!code)continue;if(!found.has(code))found.set(code,{mst:code,name:name||'',aliases:[],sell:new Set(),buy:new Set()});const p=found.get(code);if(!p.name&&name)p.name=name;if(r.seller!==r.buyer)p[role==='SELL'?'sell':'buy'].add(r.key||key(r));}return [...found.values()].map(({sell,buy,...p})=>({...p,sellCount:sell.size,buyCount:buy.size})).filter(p=>!requireBoth||p.sellCount>0&&p.buyCount>0);}
 function assignments(rows,profiles){const owners=new Map();for(const p of profiles){for(const code of [p.mst,...p.aliases]){if(owners.has(code))throw Error('Mã '+code+' đang thuộc nhiều hồ sơ.');owners.set(code,p);}}
  const output=[];for(const r of rows){const sell=owners.get(r.seller),buy=owners.get(r.buyer);if(!sell&&!buy){output.push({...r,state:'unmatched',error:'Không thuộc hồ sơ đã chọn.'});continue;}if(sell&&sell===buy){output.push({...r,state:'unmatched',error:'Hai bên cùng thuộc một hồ sơ; cần kiểm tra.'});continue;}
   for(const [p,direction]of [[sell,'SELL'],[buy,'BUY']])if(p)output.push({...r,mst:p.mst,direction,state:'ready'});
  }return output;
 }
 const folder=direction=>direction==='SELL'?'Ban_ra':'Mua_vao';
 const filename=r=>[r.seller,r.model,r.series,number(r.number),r.hash.slice(0,10)].map(safe).join('_')+'.xml';
 async function child(dir,parts,create=false){for(const p of parts)dir=await dir.getDirectoryHandle(p,{create});return dir;}
 async function write(dir,name,bytes){let existed=false;try{await dir.getFileHandle(name);existed=true;}catch(e){if(e.name!=='NotFoundError')throw e;}if(existed)throw Error('Tệp đích đã tồn tại; không ghi đè.');const handle=await dir.getFileHandle(name,{create:true});let stream;
  try{stream=await handle.createWritable();await stream.write(bytes);await stream.close();stream=null;const actual=new Uint8Array(await(await handle.getFile()).arrayBuffer());if(await hash(actual)!==await hash(bytes))throw Error('Tệp ghi ra không khớp.');}catch(e){try{await stream?.abort();await dir.removeEntry(name);}catch{}throw e;}
 }
 async function index(dir,{files:provided,onIssue=()=>{},stopped=()=>false}={}){const map=new Map();let files;try{files=provided||await snapshot(dir,'',[],0,stopped);}catch(e){onIssue(dir.name,e.message);throw e;}
  for(const s of files){if(stopped())throw Error('Đã dừng.');if(!/\.xml$/i.test(s.name))continue;try{const bytes=new Uint8Array(await(await s.file()).arrayBuffer()),r=parse(bytes),h=await hash(bytes);if(!map.has(r.key))map.set(r.key,new Set());map.get(r.key).add(h);}catch(e){onIssue(s.name,e.message);throw Error('Kho đích có XML chưa đọc được; cần kiểm tra trước khi chống trùng: '+s.name);}}return map;}
 function conflicts(rows,existing){const groups=new Map();for(const r of rows){if(r.state!=='ready')continue;const id=r.mst+'|'+r.direction+'|'+r.key;if(!groups.has(id))groups.set(id,new Set());groups.get(id).add(r.hash);}
  for(const r of rows){if(r.state!=='ready')continue;const set=existing.get(r.mst+'|'+r.direction)?.get(r.key)||new Set(),batch=groups.get(r.mst+'|'+r.direction+'|'+r.key);if(new Set([...set,...batch]).size>1){r.state='conflict';r.error='Cùng định danh nhưng khác nội dung; không ghi vào kho.';}else if(set.has(r.hash))r.state='duplicate';}
  return rows;
 }
 function pdfValid(bytes){return bytes.length>=20&&new TextDecoder().decode(bytes.slice(0,5))==='%PDF-'&&new TextDecoder().decode(bytes.slice(-2048)).includes('%%EOF');}
 return {limits,safe,key,decode,parse,hash,snapshot,collect,profilesFrom,assignments,folder,filename,child,write,index,conflicts,pdfValid};
});
