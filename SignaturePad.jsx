*{box-sizing:border-box}
:root{font-family:Arial,Helvetica,sans-serif;color:#171717;background:#f3f4f6;--red:#d71920;--dark:#151515;--muted:#6b7280}
body{margin:0;background:#f3f4f6}.app-shell{min-height:100vh}.topbar{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #e7e7e7}
.brand-button{width:100%;max-width:900px;margin:auto;padding:12px 16px;border:0;background:#fff;display:flex;align-items:center;gap:11px;text-align:left}
.brand-button strong{display:block}.brand-button small{display:block;color:var(--muted);margin-top:2px}.brand-mark{width:42px;height:42px;border-radius:12px;background:var(--red);color:#fff;display:grid;place-items:center;font-weight:900}
.container{max-width:900px;margin:auto;padding:16px}.hero{border-radius:20px;padding:26px;background:linear-gradient(135deg,#d71920,#8d0f14);color:white;margin-bottom:18px}
.hero h1{margin:6px 0;font-size:28px}.hero p{margin:0;opacity:.92}.eyebrow{font-size:12px!important;font-weight:800;letter-spacing:1px}
.menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.menu-card{border:1px solid #e8e8e8;background:#fff;border-radius:16px;padding:16px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;text-align:left;box-shadow:0 4px 14px #0000000c}
.menu-card strong,.menu-card small{display:block}.menu-card small{color:var(--muted);margin-top:5px;line-height:1.35}.menu-icon{font-size:26px}.arrow{font-size:28px;color:#aaa}
.card{background:#fff;border-radius:16px;padding:18px;margin-bottom:14px;box-shadow:0 4px 14px #0000000b;border:1px solid #ededed}.card h2{margin:0 0 14px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.form-grid .full{grid-column:1/-1}
label{font-weight:700;font-size:14px}input,select,textarea{width:100%;font:inherit;font-size:16px;padding:12px;border:1px solid #cfd3d8;border-radius:10px;margin-top:6px;background:#fff}
textarea{min-height:100px;resize:vertical}.goods-list{display:grid;gap:9px}.goods-row{display:grid;grid-template-columns:auto 1.2fr .6fr 1fr .6fr;gap:8px;align-items:center;padding:10px;border:1px solid #e6e6e6;border-radius:11px}.goods-row input[type=checkbox]{width:auto;transform:scale(1.25);margin:0}
.signature{display:block;width:100%;height:210px;border:2px dashed #aaa;border-radius:12px;background:#fff;touch-action:none;margin-top:6px}.btn{border:0;border-radius:10px;padding:13px 16px;font-size:16px;font-weight:800}.primary{width:100%;background:var(--red);color:#fff;margin-top:14px}.secondary{background:#eceff2;margin-top:10px}
.checkline{display:flex;gap:9px;align-items:flex-start;margin-top:14px;font-weight:400}.checkline input{width:auto;margin-top:2px}.legal p{line-height:1.55}
@media(max-width:700px){.menu-grid,.form-grid{grid-template-columns:1fr}.goods-row{grid-template-columns:auto 1fr}.goods-row input[type=number],.goods-row select,.goods-row b{grid-column:2}}
@media print{.topbar,.hero,.menu-grid,.btn.secondary{display:none!important}.container{max-width:none;padding:0}.card{box-shadow:none;border:0;border-radius:0;page-break-inside:avoid}}

.hint{font-size:12px;color:var(--muted);line-height:1.45}
.hero.compact{padding:20px}
.doc-page h3{margin-top:24px}
.long-text p,.long-text li{line-height:1.55}
.checklist{display:grid;gap:8px}
.check-item{display:flex;align-items:center;gap:10px;padding:11px;border:1px solid #e5e7eb;border-radius:10px;font-weight:600}
.check-item input{width:auto;margin:0;transform:scale(1.2)}
@media print{
 .topbar{display:none!important}
 .doc-page{box-shadow:none!important;border:0!important;padding:0!important}
 .btn,.hint{display:none!important}
 input,select,textarea{border:0!important;padding:0!important}
}
