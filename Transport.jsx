import React from 'react';

const items = [
  ['onboarding', '📁', 'Dokumenty zatrudnienia', 'Kwestionariusz, bank, ZUS, poufność, PPK i checklista.'],
  ['clothing', '👕', 'Odzież i wyposażenie', 'Wydanie, zwrot i podpis dokumentu.'],
  ['vacation', '🏖️', 'Wniosek o urlop', 'Wpisz daty i podpisz wniosek.'],
  ['transport', '🚐', 'Transport do pracy', 'Potwierdź sposób dojazdu.'],
  ['housing', '🏠', 'Zakwaterowanie', 'Przyjęcie lub zdanie miejsca.'],
  ['contact', '💬', 'Kontakt z koordynatorem', 'Przygotuj wiadomość do koordynatora.'],
];

export default function Home({ worker, openPage }) {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">PORTAL PRACOWNIKA</p>
          <h1>{worker?.name ? `Dzień dobry, ${worker.name}` : 'Witaj w WeGoJob'}</h1>
          <p>Dokumenty i zgłoszenia w jednym miejscu.</p>
        </div>
      </section>

      <div className="menu-grid">
        {items.map(([id, icon, title, desc]) => (
          <button className="menu-card" key={id} onClick={() => openPage(id)}>
            <span className="menu-icon">{icon}</span>
            <span>
              <strong>{title}</strong>
              <small>{desc}</small>
            </span>
            <span className="arrow">›</span>
          </button>
        ))}
      </div>
    </>
  );
}
