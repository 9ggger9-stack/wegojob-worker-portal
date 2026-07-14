import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import DocumentActions from '../components/DocumentActions';
import { loadOnboarding, saveOnboarding } from '../services/onboardingStore';

const initial = {
  surname:'', firstName:'', birthDate:'', birthPlace:'', pesel:'', documentNumber:'',
  issuedBy:'', phone:'', messenger:'', email:'', height:'', clothingSize:'', shoeSize:'',
  regProvince:'', regPostal:'', regCity:'', regMunicipality:'', regStreet:'',
  homeSame:true, homeProvince:'', homePostal:'', homeCity:'', homeMunicipality:'', homeStreet:'',
  company:'We Go Job Sp. z o.o.', consent:false
};

export default function PersonalQuestionnaire() {
  const sig = useRef();
  const [form,setForm]=useState(initial);
  useEffect(()=>setForm(v=>({...v,...loadOnboarding()})),[]);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  function submit(){
    if(!form.surname || !form.firstName || !form.documentNumber) return alert('Uzupełnij wymagane dane.');
    if(!sig.current.isSigned()) return alert('Złóż podpis.');
    saveOnboarding({...form, fullName:`${form.firstName} ${form.surname}`, signature:sig.current.toDataURL()});
    setTimeout(()=>window.print(),150);
  }

  return <div>
    <section className="card doc-page">
      <h2>Kwestionariusz osobowy</h2>
      <div className="form-grid">
        <label>Nazwisko / nazwiska<input required value={form.surname} onChange={e=>set('surname',e.target.value)}/></label>
        <label>Imię / imiona<input required value={form.firstName} onChange={e=>set('firstName',e.target.value)}/></label>
        <label>Data urodzenia<input type="date" value={form.birthDate} onChange={e=>set('birthDate',e.target.value)}/></label>
        <label>Miejsce urodzenia<input value={form.birthPlace} onChange={e=>set('birthPlace',e.target.value)}/></label>
        <label>PESEL<input inputMode="numeric" value={form.pesel} onChange={e=>set('pesel',e.target.value)}/></label>
        <label>Seria i numer dowodu / paszportu<input required value={form.documentNumber} onChange={e=>set('documentNumber',e.target.value)}/></label>
        <label>Wydany przez<input value={form.issuedBy} onChange={e=>set('issuedBy',e.target.value)}/></label>
        <label>Numer telefonu<input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)}/></label>
        <label>WhatsApp / Viber<input value={form.messenger} onChange={e=>set('messenger',e.target.value)}/></label>
        <label>E-mail<input type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></label>
        <label>Wzrost<input value={form.height} onChange={e=>set('height',e.target.value)}/></label>
        <label>Rozmiar odzieży<input value={form.clothingSize} onChange={e=>set('clothingSize',e.target.value)}/></label>
        <label>Rozmiar buta<input value={form.shoeSize} onChange={e=>set('shoeSize',e.target.value)}/></label>
      </div>

      <h3>Adres zameldowania</h3>
      <div className="form-grid">
        <label>Województwo<input value={form.regProvince} onChange={e=>set('regProvince',e.target.value)}/></label>
        <label>Kod pocztowy<input value={form.regPostal} onChange={e=>set('regPostal',e.target.value)}/></label>
        <label>Miejscowość<input value={form.regCity} onChange={e=>set('regCity',e.target.value)}/></label>
        <label>Gmina<input value={form.regMunicipality} onChange={e=>set('regMunicipality',e.target.value)}/></label>
        <label className="full">Ulica, numer budynku i mieszkania<input value={form.regStreet} onChange={e=>set('regStreet',e.target.value)}/></label>
      </div>

      <label className="checkline"><input type="checkbox" checked={form.homeSame} onChange={e=>set('homeSame',e.target.checked)}/> Adres zamieszkania jest taki sam.</label>
      {!form.homeSame && <>
        <h3>Adres zamieszkania</h3>
        <div className="form-grid">
          <label>Województwo<input value={form.homeProvince} onChange={e=>set('homeProvince',e.target.value)}/></label>
          <label>Kod pocztowy<input value={form.homePostal} onChange={e=>set('homePostal',e.target.value)}/></label>
          <label>Miejscowość<input value={form.homeCity} onChange={e=>set('homeCity',e.target.value)}/></label>
          <label>Gmina<input value={form.homeMunicipality} onChange={e=>set('homeMunicipality',e.target.value)}/></label>
          <label className="full">Ulica, numer budynku i mieszkania<input value={form.homeStreet} onChange={e=>set('homeStreet',e.target.value)}/></label>
        </div>
      </>}

      <div className="legal">
        <p>Podając powyższe dane, wyrażam zgodę na ich przetwarzanie przez {form.company} dla potrzeb niezbędnych do realizacji procesu rekrutacji, zgodnie z obowiązującymi przepisami o ochronie danych osobowych i RODO.</p>
        <p>Wyrażam zgodę na przetwarzanie moich danych osobowych w związku z zatrudnieniem, na potrzeby czynności kadrowych, płacowych i ubezpieczeniowych. Zostałem/am poinformowany/a o prawie dostępu do danych, ich poprawiania oraz wycofania zgody.</p>
      </div>

      <label>Podpis pracownika</label><SignaturePad ref={sig}/>
      <label className="checkline"><input type="checkbox" required checked={form.consent} onChange={e=>set('consent',e.target.checked)}/> Potwierdzam zgodność danych i udzielam powyższych zgód.</label>
      <DocumentActions onPrint={submit}/>
    </section>
  </div>;
}
