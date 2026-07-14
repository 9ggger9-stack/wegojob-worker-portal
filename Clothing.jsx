import React from 'react';

export default function DocumentActions({ onPrint, label='Zatwierdź i zapisz jako PDF' }) {
  return (
    <>
      <button type="button" className="btn primary" onClick={onPrint}>{label}</button>
      <p className="hint">Na telefonie wybierz: Drukuj → Zapisz jako PDF.</p>
    </>
  );
}
