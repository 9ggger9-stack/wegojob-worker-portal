import React from 'react';
import { loadProgress } from '../services/progressStore';

const docs=[
 ['personal','👤','Kwestionariusz osobowy','Dane osobowe, adres, RODO i rozmiary.'],
 ['bank','🏦','Konto bankowe','Dyspozycja przelewu wynagrodzenia.'],
 ['zus','🧾','Oświadczenie do celów ZUS','Status zatrudnienia, nauki i ubezpieczeń.'],
 ['confidentiality','🔒','Oświadczenie o poufności','Zobowiązanie do zachowania poufności.'],
 ['ppk','📉','Rezygnacja z PPK','Deklaracja rezygnacji z wpłat.'],
 ['photos','📷','Zdjęcia dokumentów','Paszport, karta pobytu/dowód i PESEL.'],
 ['checklist','✅','Checklista dokumentów','Kontrola kompletności teczki pracownika.'],
];

export default function Onboarding({openPage}){
 const p=loadProgress();
 return <>
  <section className="hero compact"><p className="eyebrow">ONBOARDING</p><h1>Pakiet dokumentów pracownika</h1><p>Najpierw wypełnij kwestionariusz. Dane zostaną użyte w kolejnych dokumentach.</p></section>
  <div className="menu-grid">{docs.map(([id,icon,title,desc])=><button className="menu-card" key={id} onClick={()=>openPage(id)}>
   <span className="menu-icon">{icon}</span><span><strong>{title}</strong><small>{desc}</small></span><span className="completion">{p[id]?'✓':'›'}</span>
  </button>)}</div>
 </>;
}
