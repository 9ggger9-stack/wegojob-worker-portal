import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import DocumentActions from '../components/DocumentActions';
import { loadOnboarding } from '../services/onboardingStore';

export default function Confidentiality(){
 const sig=useRef();
 const [name,setName]=useState('');
 useEffect(()=>setName(loadOnboarding().fullName||''),[]);
 function submit(){if(!name)return alert('Wpisz imię i nazwisko.');if(!sig.current.isSigned())return alert('Złóż podpis.');setTimeout(()=>window.print(),150)}
 return <section className="card doc-page">
  <h2>Oświadczenie o zachowaniu poufności</h2>
  <label>Imię i nazwisko<input value={name} onChange={e=>setName(e.target.value)}/></label>
  <div className="legal long-text">
    <p>Ja, niżej podpisany/a <b>{name || '................................'}</b>, niniejszym oświadczam, że posiadam świadomość i zrozumienie dotyczące znaczenia i celu zachowania poufności oraz odpowiedzialności związanej z przetwarzaniem poufnych informacji.</p>
    <p>Wyrażam zgodę na przetwarzanie i gromadzenie danych poufnych i informacji, które otrzymuję podczas wykonywania moich obowiązków lub w związku z moją działalnością zawodową.</p>
    <p>Zobowiązuję się zachować poufność w odniesieniu do wszystkich informacji uznanych za poufne i chronionych zgodnie z obowiązującymi przepisami prawa oraz polityką firmy lub instytucji, dla której pracuję.</p>
    <p>Informacje poufne obejmują w szczególności dane osobowe, informacje finansowe i rachunkowe, numery kont bankowych i kart, informacje prawne, dokumenty, umowy, dane biznesowe i zawodowe, strategie firmy, sekrety handlowe, specyfikacje, technologie, innowacje oraz informacje oznaczone klauzulą „Poufne”.</p>
    <p>Zobowiązuję się nie ujawniać, nie rozpowszechniać ani nie wykorzystywać informacji poufnych do celów prywatnych lub na nieuprawnionych podstawach. Akceptuję odpowiedzialność za szkody powstałe wskutek nieuprawnionego ujawnienia informacji.</p>
    <p>Przyjmuję do wiadomości, że obowiązek poufności może obowiązywać również po zakończeniu zatrudnienia lub współpracy.</p>
    <p>Oświadczam, że przeczytałem/am, zrozumiałem/am i zgadzam się przestrzegać wszystkich postanowień niniejszego oświadczenia.</p>
  </div>
  <label>Podpis pracownika</label><SignaturePad ref={sig}/>
  <DocumentActions onPrint={submit}/>
 </section>
}
