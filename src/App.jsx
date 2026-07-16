import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import PersonalQuestionnaire from './pages/PersonalQuestionnaire';
import BankAccount from './pages/BankAccount';
import Confidentiality from './pages/Confidentiality';
import ZusStatement from './pages/ZusStatement';
import PpkResignation from './pages/PpkResignation';
import DocumentChecklist from './pages/DocumentChecklist';
import DocumentPhotos from './pages/DocumentPhotos';
import Clothing from './pages/Clothing';
import Vacation from './pages/Vacation';
import Contact from './pages/Contact';
import CoordinatorPanel from './pages/CoordinatorPanel';

const TITLES={
 home:'Portal pracownika',onboarding:'Dokumenty zatrudnienia',personal:'Kwestionariusz osobowy',
 bank:'Konto bankowe',zus:'Oświadczenie ZUS',confidentiality:'Poufność',ppk:'Rezygnacja z PPK',
 photos:'Zdjęcia dokumentów',checklist:'Checklista',clothing:'Odzież i wyposażenie',
 vacation:'Wniosek o urlop',contact:'Kontakt z koordynatorem',coordinator:'Panel koordynatora'
};

export default function App(){
 const [page,setPage]=useState('home');
 const [worker,setWorker]=useState({name:''});
 useEffect(()=>{
  const handler=()=>setPage('home');
  window.addEventListener('popstate',handler);
  return()=>window.removeEventListener('popstate',handler);
 },[]);
 function openPage(id){history.pushState({page:id},'',`#${id}`);setPage(id)}
 function goBack(){
  if(page==='home')return;
  if(['personal','bank','zus','confidentiality','ppk','photos','checklist'].includes(page))setPage('onboarding');
  else setPage('home');
 }
 const content={
  home:<Home worker={worker} openPage={openPage}/>,onboarding:<Onboarding openPage={openPage}/>,
  personal:<PersonalQuestionnaire/>,bank:<BankAccount/>,zus:<ZusStatement/>,confidentiality:<Confidentiality/>,
  ppk:<PpkResignation/>,photos:<DocumentPhotos/>,checklist:<DocumentChecklist/>,clothing:<Clothing worker={worker}/>,
  vacation:<Vacation worker={worker}/>,contact:<Contact worker={worker}/>,coordinator:<CoordinatorPanel/>
 }[page];
 return <Layout title={TITLES[page]} onHome={()=>setPage('home')} onBack={page!=='home'?goBack:null}>{content}</Layout>
}
