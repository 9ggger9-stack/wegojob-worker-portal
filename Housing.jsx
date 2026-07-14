import React, { useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad';
import { submitDocument } from '../services/api';

const GOODS = [
  { name: 'Koszulka', price: 60, sizes: ['XS','S','M','L','XL','XXL','XXXL'] },
  { name: 'Polar', price: 90, sizes: ['XS','S','M','L','XL','XXL','XXXL'] },
  { name: 'Spodnie', price: 90, sizes: ['XS','S','M','L','XL','XXL','XXXL'] },
  { name: 'Buty', price: 140, sizes: ['36','37','38','39','40','41','42','43','44','45','46','47'] },
  { name: 'Kamizelka', price: 40, sizes: ['XS','S','M','L','XL','XXL','XXXL'] },
  { name: 'Klucz', price: 100, sizes: ['—'] },
  { name: 'Karta', price: 100, sizes: ['—'] },
];

export default function Clothing({ worker }) {
  const sig = useRef();
  const [form, setForm] = useState({
    mode: 'WYDANIE', name: worker?.name || '', workerId: worker?.id || '',
    project: worker?.project || '', date: new Date().toISOString().slice(0,10),
    notes: '', consent: false
  });
  const [items, setItems] = useState(GOODS.map(g => ({...g, selected:false, qty:1, size:''})));

  function updateItem(index, patch) {
    setItems(v => v.map((item, i) => i === index ? {...item, ...patch} : item));
  }

  async function submit(e) {
    e.preventDefault();
    const selected = items.filter(x => x.selected);
    if (!selected.length) return alert('Zaznacz co najmniej jedną rzecz.');
    if (!sig.current.isSigned()) return alert('Złóż podpis.');
    const payload = {
      type: 'clothing',
      ...form,
      items: selected,
      signature: sig.current.toDataURL(),
      createdAt: new Date().toISOString(),
    };
    await submitDocument(payload);
    window.print();
  }

  return (
    <form onSubmit={submit}>
      <section className="card">
        <h2>Protokół odzieży służbowej</h2>
        <div className="form-grid">
          <label>Rodzaj dokumentu<select value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}><option>WYDANIE</option><option>ZWROT</option></select></label>
          <label>Data<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
          <label>Imię i nazwisko<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
          <label>Nr pracownika<input required value={form.workerId} onChange={e=>setForm({...form,workerId:e.target.value})}/></label>
          <label>Projekt<input value={form.project} onChange={e=>setForm({...form,project:e.target.value})}/></label>
        </div>
      </section>

      <section className="card">
        <h2>Odzież / wyposażenie</h2>
        <div className="goods-list">
          {items.map((item, i) => (
            <div className="goods-row" key={item.name}>
              <input type="checkbox" checked={item.selected} onChange={e=>updateItem(i,{selected:e.target.checked})}/>
              <strong>{item.name}</strong>
              <input type="number" min="1" value={item.qty} onChange={e=>updateItem(i,{qty:e.target.value})}/>
              <select value={item.size} onChange={e=>updateItem(i,{size:e.target.value})}>
                <option value="">Rozmiar</option>
                {item.sizes.map(s=><option key={s}>{s}</option>)}
              </select>
              <b>{item.price} zł</b>
            </div>
          ))}
        </div>
        <label>Uwagi<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
      </section>

      <section className="card legal">
        <h2>Oświadczenie pracownika</h2>
        <p>Zgodnie z art. 91 Kodeksu pracy oświadczam, że wyrażam zgodę na potrącenie przez pracodawcę z mojego wynagrodzenia za pracę należności wynikającej z nierozliczenia się z odzieży służbowej lub wyposażenia, w kwocie zgodnej z tabelą.</p>
        <p>Wysokość potrącenia zależy od okresu zatrudnienia: do 3 miesięcy – 100% wartości, od 3 do 6 miesięcy – 50% wartości, powyżej 6 miesięcy – brak potrącenia.</p>
        <p>Proszę o dokonanie potrącenia z wynagrodzenia w przypadku nierozliczenia się z odzieży służbowej lub wyposażenia w terminie do 3 dni od zakończenia pracy.</p>
      </section>

      <section className="card">
        <label>Podpis pracownika</label>
        <SignaturePad ref={sig}/>
        <label className="checkline"><input type="checkbox" required checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})}/> Potwierdzam prawdziwość danych i treść oświadczenia.</label>
        <button className="btn primary">Zatwierdź i zapisz jako PDF</button>
      </section>
    </form>
  );
}
