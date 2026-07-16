import React from 'react';

const items=[
 ['onboarding','📁','Dokumenty zatrudnienia','Kwestionariusz, bank, ZUS, poufność, PPK, zdjęcia dokumentów i checklista.'],
 ['clothing','👕','Odzież i wyposażenie','Wydanie, zwrot i podpis protokołu.'],
 ['vacation','🏖️','Wniosek o urlop','Wypełnij i podpisz wniosek.'],
 ['contact','💬','Kontakt z koordynatorem','Przygotuj wiadomość dotyczącą pracy lub dokumentów.'],
 ['coordinator','🧑‍💼','Panel koordynatora','Podgląd danych i kompletności dokumentów na tym urządzeniu.'],
];

export default function Home({worker,openPage}){
 return <>
  <section className="hero">
   <p className="eyebrow">WEGOJOB PORTAL V4</p>
   <h1>{worker?.name?`Dzień dobry, ${worker.name}`:'Portal pracownika'}</h1>
   <p>Dokumenty, zdjęcia i podpisy w jednym miejscu.</p>
  </section>
  <div className="menu-grid">
   {items.map(([id,icon,title,desc])=><button className="menu-card" key={id} onClick={()=>openPage(id)}>
    <span className="menu-icon">{icon}</span><span><strong>{title}</strong><small>{desc}</small></span><span className="arrow">›</span>
   </button>)}
  </div>
 </>;
}
