import React, { useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import { submitDocument } from '../services/api';

export default function Vacation({ worker }) {
  const sig = useRef();
  const [form, setForm] = useState({name:worker?.name||'',workerId:worker?.id||'',project:worker?.project||'',from:'',to:'',kind:'Urlop wypoczynkowy',notes:''});

  async function submit(e) {
    e.preventDefault();
    if (!sig.current.isSigned()) return alert('Złóż podpis.');
    await submitDocument({ type: 'vacation', ...form, signature: sig.current.toDataURL(), createdAt: new Date().toISOString() });
    window.print();
  }

  return <form onSubmit={submit}>
    <section className="card">
      <h2>Wniosek o urlop</h2>
      <div className="form-grid"><label>Imię i nazwisko<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
<label>Nr pracownika<input required value={form.workerId} onChange={e=>setForm({...form,workerId:e.target.value})}/></label>
<label>Projekt<input value={form.project} onChange={e=>setForm({...form,project:e.target.value})}/></label>
<label>Urlop od<input type="date" required value={form.from} onChange={e=>setForm({...form,from:e.target.value})}/></label>
<label>Urlop do<input type="date" required value={form.to} onChange={e=>setForm({...form,to:e.target.value})}/></label>
<label>Rodzaj<select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}><option>Urlop wypoczynkowy</option><option>Urlop bezpłatny</option><option>Inne</option></select></label>
<label className="full">Powód / uwagi<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label></div>
    </section>
    <section className="card">
      <label>Podpis pracownika</label>
      <SignaturePad ref={sig}/>
      <label className="checkline"><input type="checkbox" required/> Potwierdzam prawdziwość podanych danych.</label>
      <button className="btn primary">Zatwierdź i zapisz jako PDF</button>
    </section>
  </form>;
}
