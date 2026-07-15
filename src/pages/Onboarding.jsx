import React from 'react';
const docs = [
  ['personal','👤','Kwestionariusz osobowy + RODO','Dane osobowe, adres, kontakt i rozmiary.'],
  ['bank','🏦','Konto bankowe','Dyspozycja przelewu wynagrodzenia.'],
  ['zus','🧾','Oświadczenie ZUS i podatek','Status zatrudnienia, nauki, ubezpieczeń i wniosek podatkowy.'],
  ['confidentiality','🔒','Oświadczenie o poufności','Pełne zobowiązanie do zachowania poufności.'],
  ['ppk','📉','Rezygnacja z PPK','Deklaracja rezygnacji z dokonywania wpłat.'],
  ['checklist','✅','Checklista dokumentów','Kontrola kompletności dokumentacji pracownika.'],
];
export default function Onboarding({openPage}){
  return <>
    <section className="hero compact"><p className="eyebrow">ONBOARDING</p><h1>Pakiet dokumentów pracownika</h1><p>Dane zapisane w kwestionariuszu automatycznie uzupełniają kolejne formularze.</p></section>
    <div className="menu-grid">{docs.map(([id,icon,title,desc])=><button className="menu-card" key={id} onClick={()=>openPage(id)}><span className="menu-icon">{icon}</span><span><strong>{title}</strong><small>{desc}</small></span><span className="arrow">›</span></button>)}</div>
  </>;
}
