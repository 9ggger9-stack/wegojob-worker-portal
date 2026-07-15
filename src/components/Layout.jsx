import React from 'react';

export default function Layout({ children, onHome, onBack, canGoBack, title }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          {canGoBack && (
            <button className="back-button" onClick={onBack} aria-label="Wróć do poprzedniego działu">
              <span aria-hidden="true">←</span><span>Wstecz</span>
            </button>
          )}
          <button className="brand-button" onClick={onHome}>
            <span className="brand-mark">WG</span>
            <span><strong>WEGOJOB</strong><small>{title || 'Portal pracownika'}</small></span>
          </button>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
