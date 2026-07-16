import React, { useEffect, useState } from 'react';
import { loadOnboarding } from '../services/onboardingStore';
import { loadProgress, progressPercent } from '../services/progressStore';

const LABELS={
 personal:'Kwestionariusz osobowy',
 bank:'Konto bankowe',
 zus:'Oświadczenie ZUS',
 confidentiality:'Poufność',
 ppk:'Rezygnacja z PPK',
 photos:'Zdjęcia dokumentów',
 clothing:'Protokół odzieży',
 vacation:'Wniosek urlopowy',
};

export default function CoordinatorPanel(){
 const [employee,setEmployee]=useState({});
 const [progress,setProgress]=useState({});
 useEffect(()=>{setEmployee(loadOnboarding());setProgress(loadProgress())},[]);
 const percent=progressPercent();
 return <>
  <section className="hero compact">
   <p className="eyebrow">PANEL KOORDYNATORA — WERSJA PODGLĄDOWA</p>
   <h1>{employee.fullName||'Brak danych pracownika'}</h1>
   <p>Status danych zapisanych na tym urządzeniu. Centralna lista pracowników zostanie podłączona przez Make i Google Sheets.</p>
  </section>
  <section className="card">
   <div className="status-top"><div><strong>Postęp onboardingu</strong><div className="progress-value">{percent}%</div></div><div className={percent===100?'status-ready':'status-process'}>{percent===100?'GOTOWY':'W TRAKCIE'}</div></div>
   <div className="progress-track"><div style={{width:`${percent}%`}}/></div>
   <div className="employee-data">
    <p><b>PESEL:</b> {employee.pesel||'—'}</p>
    <p><b>Paszport:</b> {employee.documentNumber||'—'}</p>
    <p><b>Telefon:</b> {employee.phone||'—'}</p>
    <p><b>E-mail:</b> {employee.email||'—'}</p>
   </div>
  </section>
  <section className="card">
   <h2>Kompletność dokumentów</h2>
   <div className="checklist">
    {Object.entries(LABELS).map(([id,label])=><div className="check-item" key={id}><span>{progress[id]?'✅':'⬜'}</span><span>{label}</span></div>)}
   </div>
  </section>
 </>;
}
