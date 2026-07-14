import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import DocumentActions from '../components/DocumentActions';
import { loadOnboarding } from '../services/onboardingStore';

export default function PpkResignation(){
 const sig=useRef();
 const base=loadOnboarding();
 const [f,setF]=useState({firstName:base.firstName||'',surname:base.surname||'',pesel:base.pesel||'',documentNumber:base.documentNumber||'',employer:'We Go Job Sp. z o.o.',date:new Date().toISOString().slice(0,10)});
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 function submit(){if(!f.firstName||!f.surname)return alert('Uzupełnij imię i nazwisko.');if(!sig.current.isSigned())return alert('Złóż podpis.');setTimeout(()=>window.print(),150)}
 return <section className="card doc-page">
  <h2>Rezygnacja z dokonywania wpłat do PPK</h2>
  <div className="form-grid">
   <label>Imię / imiona<input value={f.firstName} onChange={e=>set('firstName',e.target.value)}/></label>
   <label>Nazwisko<input value={f.surname} onChange={e=>set('surname',e.target.value)}/></label>
   <label>PESEL / data urodzenia<input value={f.pesel} onChange={e=>set('pesel',e.target.value)}/></label>
   <label>Seria i numer dokumentu<input value={f.documentNumber} onChange={e=>set('documentNumber',e.target.value)}/></label>
   <label className="full">Podmiot zatrudniający<input value={f.employer} onChange={e=>set('employer',e.target.value)}/></label>
   <label>Data<input type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></label>
  </div>
  <div className="legal long-text">
   <p><b>Oświadczam, że rezygnuję z dokonywania wpłat do PPK</b> oraz posiadam wiedzę o konsekwencjach złożenia niniejszej deklaracji, w tym:</p>
   <ol>
    <li>nieotrzymania wpłaty powitalnej w wysokości 250 zł, jeżeli nie nabyłem/am do niej prawa przed złożeniem deklaracji;</li>
    <li>nieotrzymywania dopłat rocznych do PPK w wysokości 240 zł po spełnieniu ustawowych warunków;</li>
    <li>nieotrzymywania wpłat podstawowych finansowanych przez podmiot zatrudniający w wysokości 1,5% wynagrodzenia.</li>
   </ol>
  </div>
  <label>Podpis uczestnika PPK</label><SignaturePad ref={sig}/>
  <DocumentActions onPrint={submit}/>
 </section>
}
