import React, { useMemo, useState } from 'react';
import { loadOnboarding } from '../services/onboardingStore.js';

export default function Contact() {
  const employee = useMemo(() => loadOnboarding(), []);
  const [topic, setTopic] = useState('Dokumenty');
  const [message, setMessage] = useState('');

  const fullName = employee.fullName || `${employee.firstName || ''} ${employee.surname || ''}`.trim();

  function copyMessage() {
    const text = `Dzień dobry,\n\n${fullName ? `Nazywam się ${fullName}. ` : ''}Temat: ${topic}.\n${message}\n\nProszę o kontakt.`;
    navigator.clipboard?.writeText(text)
      .then(() => alert('Wiadomość została skopiowana.'))
      .catch(() => alert('Nie udało się skopiować. Zaznacz tekst ręcznie.'));
  }

  return (
    <section className="card doc-page">
      <h2>Kontakt z koordynatorem</h2>
      <p className="hint">Przygotuj wiadomość, a następnie skopiuj ją do WhatsApp lub SMS.</p>
      <div className="form-grid">
        <label>Temat
          <select value={topic} onChange={e => setTopic(e.target.value)}>
            <option>Dokumenty</option>
            <option>Grafik pracy</option>
            <option>Wynagrodzenie</option>
            <option>Odzież i wyposażenie</option>
            <option>Inna sprawa</option>
          </select>
        </label>
        <label className="full">Wiadomość
          <textarea rows="7" value={message} onChange={e => setMessage(e.target.value)} placeholder="Opisz swoją sprawę..." />
        </label>
      </div>
      <button type="button" className="btn primary" onClick={copyMessage} disabled={!message.trim()}>
        Kopiuj wiadomość
      </button>
    </section>
  );
}
