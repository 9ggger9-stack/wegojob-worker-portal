import React from 'react';
export default function Layout({children,onHome,onBack,title}){
 return <div className="app-shell">
  <header className="topbar"><div className="topbar-inner">
   {onBack?<button className="back-button" onClick={onBack}>← Wstecz</button>:<span/>}
   <button className="brand-button" onClick={onHome}><span className="brand-mark">WG</span><span><strong>WEGOJOB</strong><small>{title||'Portal pracownika'}</small></span></button>
  </div></header>
  <main className="container">{children}</main>
 </div>
}
