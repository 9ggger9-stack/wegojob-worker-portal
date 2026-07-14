import React, { useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import { submitDocument } from '../services/api';

export default function Transport({ worker }) {
  const sig = useRef();
  const [form, setForm] = useState({name:worker?.name||'',workerId:worker?.id||'',project:worker?.project||'',date:new Date().toISOString().slice(0,10),method:'Transport firmowy',need:'Tak',shift:'',notes:''});

  async function submit(e) {
    e.preventDefault();
    if (!sig.current.isSigned()) return alert('Złóż podpis.');
    await submitDocument({ type: 'transport', ...form, signature: sig.current.toDataURL(), createdAt: new Date().toISOString() });
    window.print();
  }

  return <form onSubmit={submit}>
    <section className="card">
      <h2>Transport do pracy</h2>
      <div className="form-grid"><label>Imię i nazwisko<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
<label>Nr pracownika<input required value={form.workerId} onChange={e=>setForm({...form,workerId:e.target.value})}/></label>
<label>Projekt<input value={form.project} onChange={e=>setForm({...form,project:e.target.value})}/></label>
<label>Data<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
<label>Sposób dojazdu<select value={form.method} onChange={e=>setForm({...form,method:e.target.value})}><option>Transport firmowy</option><option>Własny samochód</option><option>Rower</option><option>Komunikacja publiczna</option><option>Pieszo</option><option>Inne</option></select></label>
<label>Miejsce w transporcie<select value={form.need} onChange={e=>setForm({...form,need:e.target.value})}><option>Tak</option><option>Nie</option></select></label>
<label>Zmiana / godziny<input value={form.shift} onChange={e=>setForm({...form,shift:e.target.value})}/></label>
<label className="full">Uwagi<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label></div>
    </section>
    <section className="card">
      <label>Podpis pracownika</label>
      <SignaturePad ref={sig}/>
      <label className="checkline"><input type="checkbox" required/> Potwierdzam prawdziwość podanych danych.</label>
      <button className="btn primary">Zatwierdź i zapisz jako PDF</button>
    </section>
  </form>;
}
