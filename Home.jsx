import React from 'react';

export default function Layout({ children, onHome, title }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={onHome}>
          <span className="brand-mark">WG</span>
          <span>
            <strong>WEGOJOB</strong>
            <small>{title || 'Portal pracownika'}</small>
          </span>
        </button>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
