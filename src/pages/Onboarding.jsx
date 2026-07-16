import React,{useEffect,useState}from'react';
import{loadProgress}from'../services/progressStore.js';

const docs=[
 ['personal','👤','Kwestionariusz osobowy + RODO','Dane osobowe, adres, kontakt i rozmiary.'],
 ['bank','🏦','Konto bankowe','Dyspozycja przelewu wynagrodzenia.'],
 ['zus','🧾','Oświadczenie ZUS i podatek','Status zatrudnienia, nauki, ubezpieczeń i wniosek podatkowy.'],
 ['confidentiality','🔒','Oświadczenie o poufności','Pełne zobowiązanie do zachowania poufności.'],
 ['ppk','📉','Rezygnacja z PPK','Deklaracja rezygnacji z dokonywania wpłat.'],
 ['checklist','✅','Checklista dokumentów','Kontrola kompletności dokumentacji pracownika.'],
];

export default function Onboarding({openPage}){
 const[progress,setProgress]=useState(loadProgress());
 useEffect(()=>{const refresh=()=>setProgress(loadProgress());window.addEventListener('wegojob-progress-updated',refresh);return()=>window.removeEventListener('wegojob-progress-updated',refresh)},[]);
 return <>
  <section className="hero compact"><p className="eyebrow">ONBOARDING</p><h1>Pakiet dokumentów pracownika</h1><p>Wypełniaj dokumenty po kolei. Po podpisaniu dane automatycznie trafiają do Make i Google Sheets.</p></section>
  <div className="steps-list">{docs.map(([id,icon,title,desc],index)=>{const done=!!progress[id]?.completed;const previousDone=index===0||!!progress[docs[index-1][0]]?.completed;return <button className={`step-card ${done?'done':''} ${!previousDone?'locked':''}`} key={id} disabled={!previousDone} onClick={()=>openPage(id)}><span className="step-number">{done?'✓':index+1}</span><span className="menu-icon">{icon}</span><span><strong>{title}</strong><small>{done?'Dokument podpisany i wysłany':!previousDone?'Najpierw ukończ poprzedni krok':desc}</small></span><span className="arrow">›</span></button>})}</div>
 </>;
}
