import React,{useEffect,useRef,useState} from 'react';
import SignaturePad from '../components/SignaturePad.jsx';
import {submitPortalDocument} from '../services/documentSubmit.js';
import {generatePersonalQuestionnairePdf} from '../services/pdfGenerator.js';
import {loadOnboarding,saveOnboarding} from '../services/onboardingStore.js';
const initial={surname:'',firstName:'',birthDate:'',birthPlace:'',pesel:'',documentNumber:'',issuedBy:'',phone:'',messenger:'',email:'',height:'',clothingSize:'',shoeSize:'',regProvince:'',regPostal:'',regCity:'',regMunicipality:'',regStreet:'',homeSame:true,homeProvince:'',homePostal:'',homeCity:'',homeMunicipality:'',homeStreet:'',consent:false};
export default function PersonalQuestionnaire(){
 const sig = useRef();
const submitLock = useRef(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [f, setF] = useState(initial);;useEffect(()=>setF(v=>({...v,...loadOnboarding()})),[]);const set=(k,v)=>setF(x=>({...x,[k]:v}));
 
const submit = async (e) => {
  e.preventDefault();

  // Блокуємо повторне натискання негайно
  if (submitLock.current) return;

  if (!f.firstName || !f.surname || !f.documentNumber) {
    return alert('Uzupełnij wymagane dane.');
  }

  if (!sig.current.isSigned()) {
    return alert('Złóż podpis.');
  }

  submitLock.current = true;
  setIsSubmitting(true);

  try {
    const signature = sig.current.toDataURL();

    const pdfBlob = await generatePersonalQuestionnairePdf(
      {
        firstName: f.firstName,
        lastName: f.surname,
        pesel: f.pesel,
        phone: f.phone,
        email: f.email,
      },
      {
        ...f,
        fullName: `${f.firstName} ${f.surname}`,
      },
      signature
    );

    await submitPortalDocument({
      type: 'personal',
      data: {
        ...f,
        fullName: `${f.firstName} ${f.surname}`,
      },
      signature,
      pdf: pdfBlob,
    });

    alert('Dokument został wysłany do systemu.');
  } catch (error) {
    console.error(error);
    alert(`Nie udało się wysłać danych: ${error.message}`);
  } finally {
    submitLock.current = false;
    setIsSubmitting(false);
  }
};

 return <form onSubmit={submit}><section className="card doc-page"><h2>Kwestionariusz osobowy</h2><div className="form-grid">
 <label>Nazwisko / nazwiska<input required value={f.surname} onChange={e=>set('surname',e.target.value)}/></label><label>Imię / imiona<input required value={f.firstName} onChange={e=>set('firstName',e.target.value)}/></label><label>Data urodzenia<input type="date" value={f.birthDate} onChange={e=>set('birthDate',e.target.value)}/></label><label>Miejsce urodzenia<input value={f.birthPlace} onChange={e=>set('birthPlace',e.target.value)}/></label><label>PESEL<input inputMode="numeric" value={f.pesel} onChange={e=>set('pesel',e.target.value)}/></label><label>Seria i numer dowodu / paszportu<input required value={f.documentNumber} onChange={e=>set('documentNumber',e.target.value)}/></label><label>Wydany przez<input value={f.issuedBy} onChange={e=>set('issuedBy',e.target.value)}/></label><label>Numer telefonu<input type="tel" value={f.phone} onChange={e=>set('phone',e.target.value)}/></label><label>WhatsApp / Viber<input value={f.messenger} onChange={e=>set('messenger',e.target.value)}/></label><label>E-mail<input type="email" value={f.email} onChange={e=>set('email',e.target.value)}/></label><label>Wzrost<input value={f.height} onChange={e=>set('height',e.target.value)}/></label><label>Rozmiar odzieży<input value={f.clothingSize} onChange={e=>set('clothingSize',e.target.value)}/></label><label>Rozmiar buta<input value={f.shoeSize} onChange={e=>set('shoeSize',e.target.value)}/></label></div>
 <h3>Adres zameldowania</h3><div className="form-grid"><label>Województwo<input value={f.regProvince} onChange={e=>set('regProvince',e.target.value)}/></label><label>Kod pocztowy<input value={f.regPostal} onChange={e=>set('regPostal',e.target.value)}/></label><label>Miejscowość<input value={f.regCity} onChange={e=>set('regCity',e.target.value)}/></label><label>Gmina<input value={f.regMunicipality} onChange={e=>set('regMunicipality',e.target.value)}/></label><label className="full">Ulica, numer budynku i mieszkania<input value={f.regStreet} onChange={e=>set('regStreet',e.target.value)}/></label></div>
 <label className="checkline"><input type="checkbox" checked={f.homeSame} onChange={e=>set('homeSame',e.target.checked)}/> Adres zamieszkania jest taki sam.</label>{!f.homeSame&&<><h3>Adres zamieszkania</h3><div className="form-grid"><label>Województwo<input value={f.homeProvince} onChange={e=>set('homeProvince',e.target.value)}/></label><label>Kod pocztowy<input value={f.homePostal} onChange={e=>set('homePostal',e.target.value)}/></label><label>Miejscowość<input value={f.homeCity} onChange={e=>set('homeCity',e.target.value)}/></label><label>Gmina<input value={f.homeMunicipality} onChange={e=>set('homeMunicipality',e.target.value)}/></label><label className="full">Ulica, numer budynku i mieszkania<input value={f.homeStreet} onChange={e=>set('homeStreet',e.target.value)}/></label></div></>}
 <div className="legal"><h3>Zgoda na przetwarzanie danych osobowych</h3><p>Podając powyższe dane, wyrażam zgodę na ich przetwarzanie przez We Go Job Sp. z o.o. dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z obowiązującymi przepisami o ochronie danych osobowych oraz RODO.</p><p>Wyrażam zgodę na przetwarzanie moich danych osobowych w związku z zatrudnieniem, na potrzeby wykonywania czynności kadrowych, płacowych i ubezpieczeniowych. Oświadczam, że udzielam zgody dobrowolnie oraz zostałem/am poinformowany/a o prawie dostępu do danych, ich poprawiania i wycofania zgody.</p></div>
 <label>Podpis pracownika</label><SignaturePad ref={sig}/><label className="checkline"><input type="checkbox" required checked={f.consent} onChange={e=>set('consent',e.target.checked)}/> Potwierdzam zgodność danych i udzielam powyższych zgód.</label>
<button
  type="submit"
  className="btn primary"
  disabled={isSubmitting}
>
  {isSubmitting
    ? 'Wysyłanie... Proszę czekać'
    : 'Wyślij i zapisz jako PDF'}
</button>
</section></form>;
}
