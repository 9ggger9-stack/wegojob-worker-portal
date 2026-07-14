import React, { useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import { submitDocument } from '../services/api';

export default function Housing({ worker }) {
  const sig = useRef();
  const [form, setForm] = useState({name:worker?.name||'',workerId:worker?.id||'',project:worker?.project||'',date:new Date().toISOString().slice(0,10),action:'Przyjęcie zakwaterowania',address:'',room:'',notes:''});

  async function submit(e) {
    e.preventDefault();
    if (!sig.current.isSigned()) return alert('Złóż podpis.');
    await submitDocument({ type: 'housing', ...form, signature: sig.current.toDataURL(), createdAt: new Date().toISOString() });
    window.print();
  }

  return <form onSubmit={submit}>
    <section className="card">
      <h2>Zakwaterowanie</h2>
      <div className="form-grid"><label>Imię i nazwisko<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
<label>Nr pracownika<input required value={form.workerId} onChange={e=>setForm({...form,workerId:e.target.value})}/></label>
<label>Projekt<input value={form.project} onChange={e=>setForm({...form,project:e.target.value})}/></label>
<label>Data<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
<label>Rodzaj czynności<select value={form.action} onChange={e=>setForm({...form,action:e.target.value})}><option>Przyjęcie zakwaterowania</option><option>Zdanie zakwaterowania</option></select></label>
<label>Adres<input required value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label>
<label>Pokój / miejsce<input value={form.room} onChange={e=>setForm({...form,room:e.target.value})}/></label>
<label className="full">Stan / uwagi<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label></div>
    </section>
    <section className="card">
      <label>Podpis pracownika</label>
      <SignaturePad ref={sig}/>
      <label className="checkline"><input type="checkbox" required/> Potwierdzam prawdziwość podanych danych.</label>
      <button className="btn primary">Zatwierdź i zapisz jako PDF</button>
    </section>
  </form>;
}
