import React, { useState } from 'react';

export default function Contact({ worker }) {
  const [form,setForm]=useState({name:worker?.name||'',workerId:worker?.id||'',topic:'Grafik',message:''});
  async function copy(){
    const text=`Dzień dobry.\nPracownik: ${form.name||'-'}\nNr pracownika: ${form.workerId||'-'}\nTemat: ${form.topic}\n\n${form.message||'-'}`;
    try { await navigator.clipboard.writeText(text); alert('Wiadomość skopiowana.'); }
    catch { prompt('Skopiuj wiadomość:', text); }
  }
  return <section className="card">
    <h2>Kontakt z koordynatorem</h2>
    <div className="form-grid">
      <label>Imię i nazwisko<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
      <label>Nr pracownika<input value={form.workerId} onChange={e=>setForm({...form,workerId:e.target.value})}/></label>
      <label>Temat<select value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})}><option>Grafik</option><option>Transport</option><option>Zakwaterowanie</option><option>Dokumenty</option><option>Wynagrodzenie</option><option>Inne</option></select></label>
      <label className="full">Wiadomość<textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label>
    </div>
    <button type="button" className="btn primary" onClick={copy}>Przygotuj i skopiuj wiadomość</button>
  </section>;
}
