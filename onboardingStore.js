import React, { useEffect, useState } from 'react';

const ITEMS = [
 'Umowa zlecenie / umowa o pracę','Oświadczenie do celów ZUS','Zaświadczenie o statusie ucznia/studenta',
 'Kwestionariusz z RODO','Paszport / karta / decyzja','PESEL','Konto bankowe','PPK',
 'Skierowanie na badania lekarskie','Zaświadczenie lekarskie','Skierowanie na badania san-epid',
 'Zaświadczenie san-epid','Zgoda na potrącenia','Dyspozycja - podatek','Zaświadczenie - wózek',
 'Oświadczenie / zgłoszenie / zezwolenie','Podjęcie pracy - PUP','Zakończenie pracy - PUP'
];

export default function DocumentChecklist(){
 const [checks,setChecks]=useState(()=>JSON.parse(localStorage.getItem('wegojob_checklist')||'{}'));
 useEffect(()=>localStorage.setItem('wegojob_checklist',JSON.stringify(checks)),[checks]);
 return <section className="card">
  <h2>Checklista dokumentów pracownika</h2>
  <p className="hint">Ta lista zapisuje się na urządzeniu. Później podłączymy ją do Google Sheets.</p>
  <div className="checklist">
   {ITEMS.map(x=><label className="check-item" key={x}><input type="checkbox" checked={!!checks[x]} onChange={e=>setChecks(v=>({...v,[x]:e.target.checked}))}/><span>{x}</span></label>)}
  </div>
 </section>
}
