import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import DocumentActions from '../components/DocumentActions';
import { loadOnboarding, saveOnboarding } from '../services/onboardingStore';

export default function BankAccount(){
  const sig=useRef();
  const [f,setF]=useState({fullName:'',pesel:'',contract:'Umowa zlecenia',bankName:'',iban:'',date:new Date().toISOString().slice(0,10)});
  useEffect(()=>setF(v=>({...v,...loadOnboarding()})),[]);
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  function submit(){
    if(!f.fullName || !f.iban) return alert('Uzupełnij imię, nazwisko i numer konta.');
    if(!sig.current.isSigned()) return alert('Złóż podpis.');
    saveOnboarding({...f, bankSignature:sig.current.toDataURL()});
    setTimeout(()=>window.print(),150);
  }
  return <section className="card doc-page">
    <h2>Dyspozycja przelewu wynagrodzenia</h2>
    <div className="form-grid">
      <label>Imię i nazwisko<input value={f.fullName} onChange={e=>set('fullName',e.target.value)}/></label>
      <label>PESEL<input value={f.pesel} onChange={e=>set('pesel',e.target.value)}/></label>
      <label>Rodzaj umowy<select value={f.contract} onChange={e=>set('contract',e.target.value)}><option>Umowa zlecenia</option><option>Umowa o pracę</option></select></label>
      <label>Bank<input value={f.bankName} onChange={e=>set('bankName',e.target.value)}/></label>
      <label className="full">Numer konta / IBAN<input inputMode="numeric" value={f.iban} onChange={e=>set('iban',e.target.value.replace(/\s/g,''))}/></label>
      <label>Data<input type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></label>
    </div>
    <div className="legal"><p>Wyrażam zgodę na przekazywanie przez We Go Job Sp. z o.o. mojego wynagrodzenia z tytułu wskazanej umowy przelewem na podany rachunek bankowy.</p></div>
    <label>Podpis pracownika</label><SignaturePad ref={sig}/>
    <DocumentActions onPrint={submit}/>
  </section>
}
