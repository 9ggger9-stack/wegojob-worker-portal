import React, { useEffect, useState } from 'react';
import { submitDocument } from '../services/api';
import { loadOnboarding } from '../services/onboardingStore';
import { markCompleted } from '../services/progressStore';

const TYPES=[
 {id:'PASZPORT',label:'Paszport — strona ze zdjęciem',required:true},
 {id:'KARTA_POBYTU_LUB_DOWOD',label:'Karta pobytu lub dowód osobisty',required:true},
 {id:'PESEL',label:'Dokument lub potwierdzenie numeru PESEL',required:true},
 {id:'DECYZJA_WIZA',label:'Decyzja, wiza lub inny dokument legalizacyjny',required:false},
];

function fileToDataUrl(file){
 return new Promise((resolve,reject)=>{
  const r=new FileReader(); r.onload=()=>resolve(r.result); r.onerror=reject; r.readAsDataURL(file);
 });
}
async function prepare(file){
 if(file.size>12*1024*1024) throw new Error('Plik ma więcej niż 12 MB.');
 const raw=await fileToDataUrl(file);
 if(!file.type.startsWith('image/')) return {name:file.name,mimeType:file.type,size:file.size,base64:raw};
 const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=raw});
 const max=1600, ratio=Math.min(1,max/Math.max(img.width,img.height));
 const canvas=document.createElement('canvas');
 canvas.width=Math.round(img.width*ratio); canvas.height=Math.round(img.height*ratio);
 canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
 const base64=canvas.toDataURL('image/jpeg',.78);
 return {name:file.name.replace(/\.[^.]+$/, '')+'.jpg',mimeType:'image/jpeg',size:Math.round(base64.length*.75),base64};
}

export default function DocumentPhotos(){
 const [employee,setEmployee]=useState({});
 const [files,setFiles]=useState({});
 const [sending,setSending]=useState(false);
 useEffect(()=>setEmployee(loadOnboarding()),[]);

 async function choose(id,file){
  if(!file)return;
  try{setFiles(v=>({...v,[id]:await prepare(file)}))}
  catch(e){alert(e.message||'Nie udało się odczytać pliku.')}
 }
 async function send(){
  const missing=TYPES.filter(x=>x.required&&!files[x.id]);
  if(missing.length)return alert('Dodaj paszport, kartę pobytu/dowód oraz PESEL.');
  setSending(true);
  try{
   for(const type of TYPES){
    const file=files[type.id]; if(!file)continue;
    await submitDocument({
     documentType:'identity_file',
     fileType:type.id,
     status:'PRZESŁANO',
     employee:{
      fullName:employee.fullName||`${employee.firstName||''} ${employee.surname||''}`.trim(),
      firstName:employee.firstName||'',
      surname:employee.surname||'',
      pesel:employee.pesel||'',
      passportNumber:employee.documentNumber||'',
      phone:employee.phone||'',
      email:employee.email||'',
      project:employee.project||'',
     },
     file,
    });
   }
   markCompleted('photos');
   alert('Zdjęcia dokumentów zostały wysłane.');
  }catch(e){alert(`Błąd wysyłania: ${e.message}`)}
  finally{setSending(false)}
 }

 return <section className="card doc-page">
  <h2>Zdjęcia dokumentów</h2>
  <p className="hint">Zdjęcie powinno być ostre, bez odbłysków i obejmować wszystkie rogi dokumentu.</p>
  <div className="upload-list">
   {TYPES.map(t=>{const f=files[t.id];return <div className="upload-card" key={t.id}>
    <div className="upload-head"><strong>{t.label}</strong><span className={t.required?'required-badge':'optional-badge'}>{t.required?'WYMAGANE':'OPCJONALNE'}</span></div>
    {f?.base64&&f.mimeType.startsWith('image/')&&<img className="document-preview" src={f.base64} alt={t.label}/>}
    <label className="file-button">{f?'Zmień zdjęcie':'Zrób zdjęcie / wybierz plik'}
     <input type="file" accept="image/*,.pdf" capture="environment" onChange={e=>choose(t.id,e.target.files?.[0])}/>
    </label>
    {f&&<div className="file-status">✅ {f.name}<button type="button" onClick={()=>setFiles(v=>({...v,[t.id]:undefined}))}>Usuń</button></div>}
   </div>})}
  </div>
  <button className="btn primary" type="button" disabled={sending} onClick={send}>{sending?'Wysyłanie…':'Wyślij zdjęcia dokumentów'}</button>
 </section>
}
