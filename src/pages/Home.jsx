import React from 'react';
const items = [
  ['onboarding','📁','Dokumenty zatrudnienia','Kwestionariusz, bank, ZUS, poufność, PPK, zdjęcia dokumentów i checklista.'],
  ['clothing','👕','Odzież i wyposażenie','Wydanie, zwrot i podpis dokumentu.'],
  ['vacation','🏖️','Wniosek o urlop','Wpisz daty i podpisz wniosek.'],
];
export default function Home({openPage}){
  return <>
    <section className="hero"><p className="eyebrow">PORTAL PRACOWNIKA</p><h1>Witaj w WeGoJob</h1><p>Dokumenty i zgłoszenia w jednym miejscu.</p></section>
    <div className="menu-grid">{items.map(([id,icon,title,desc])=><button className="menu-card" key={id} onClick={()=>openPage(id)}><span className="menu-icon">{icon}</span><span><strong>{title}</strong><small>{desc}</small></span><span className="arrow">›</span></button>)}</div>
  </>;
}
