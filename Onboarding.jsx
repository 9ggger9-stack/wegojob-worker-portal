import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import DocumentActions from '../components/DocumentActions';
import { loadOnboarding } from '../services/onboardingStore';

export default function ZusStatement(){
 const sig=useRef();
 const base=loadOnboarding();
 const [f,setF]=useState({
  fullName:base.fullName||'',address:base.regStreet||'',pesel:base.pesel||'',
  otherEmployment:'Nie',otherSalaryMinimum:'Nie',business:'Nie',otherInsurance:'Nie',
  pension:'Nie',unemployed:'Nie',student:'Nie',school:'',sicknessInsurance:'Nie',
  date:new Date().toISOString().slice(0,10)
 });
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 function submit(){if(!f.fullName)return alert('Wpisz imię i nazwisko.');if(!sig.current.isSigned())return alert('Złóż podpis.');setTimeout(()=>window.print(),150)}
 const yesNo=(k)=><select value={f[k]} onChange={e=>set(k,e.target.value)}><option>Nie</option><option>Tak</option></select>;
 return <section className="card doc-page">
  <h2>Oświadczenie do celów ZUS</h2>
  <div className="form-grid">
   <label>Imię i nazwisko<input value={f.fullName} onChange={e=>set('fullName',e.target.value)}/></label>
   <label>PESEL / NIP<input value={f.pesel} onChange={e=>set('pesel',e.target.value)}/></label>
   <label className="full">Adres zamieszkania<input value={f.address} onChange={e=>set('address',e.target.value)}/></label>
   <label>Inne zatrudnienie{yesNo('otherEmployment')}</label>
   <label>Wynagrodzenie co najmniej minimalne{yesNo('otherSalaryMinimum')}</label>
   <label>Prowadzę działalność gospodarczą{yesNo('business')}</label>
   <label>Składki społeczne z innego tytułu{yesNo('otherInsurance')}</label>
   <label>Prawo do emerytury / renty{yesNo('pension')}</label>
   <label>Zarejestrowany/a jako bezrobotny/a{yesNo('unemployed')}</label>
   <label>Uczeń / student / słuchacz{yesNo('student')}</label>
   <label>Nazwa szkoły / uczelni<input value={f.school} onChange={e=>set('school',e.target.value)}/></label>
   <label>Dobrowolne ubezpieczenie chorobowe{yesNo('sicknessInsurance')}</label>
   <label>Data<input type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></label>
  </div>
  <div className="legal"><p>Świadomy/a odpowiedzialności za podanie nieprawdziwych informacji oświadczam, że powyższe dane są zgodne ze stanem faktycznym podczas wykonywania umowy dla We Go Job Sp. z o.o.</p></div>
  <label>Podpis pracownika</label><SignaturePad ref={sig}/>
  <DocumentActions onPrint={submit}/>
 </section>
}
