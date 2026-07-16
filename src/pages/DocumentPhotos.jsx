import React, { useEffect, useState } from 'react';
import { sendToMake } from '../services/api.js';
import { loadOnboarding } from '../services/onboardingStore';
import { markCompleted } from '../services/progressStore';

const TYPES = [
  { id:'PASZPORT', label:'Paszport — strona ze zdjęciem', required:true },
  { id:'KARTA_POBYTU_LUB_DOWOD', label:'Karta pobytu lub dowód osobisty', required:true },
  { id:'PESEL', label:'Dokument / potwierdzenie numeru PESEL', required:true },
  { id:'DECYZJA', label:'Decyzja / zezwolenie / inny dokument legalizacyjny', required:false },
];

async function compressImage(file) {
  if (!file.type.startsWith('image/')) {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      base64: await fileToDataUrl(file),
    };
  }

  const dataUrl = await fileToDataUrl(file);
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  const maxSide = 1600;
  const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
  const width = Math.round(img.width * ratio);
  const height = Math.round(img.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  const compressed = canvas.toDataURL('image/jpeg', 0.78);
  return {
    name: file.name.replace(/\.[^.]+$/, '') + '.jpg',
    type: 'image/jpeg',
    size: Math.round((compressed.length * 3) / 4),
    base64: compressed,
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DocumentPhotos() {
  const [employee, setEmployee] = useState({});
  const [files, setFiles] = useState({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setEmployee(loadOnboarding());
  }, []);

  async function selectFile(type, file) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('Plik jest za duży. Maksymalny rozmiar to 15 MB.');
      return;
    }
    try {
      const prepared = await compressImage(file);
      setFiles(current => ({ ...current, [type]: prepared }));
    } catch {
      alert('Nie udało się odczytać pliku. Spróbuj zrobić zdjęcie ponownie.');
    }
  }

  async function submitAll() {
    const missing = TYPES.filter(x => x.required && !files[x.id]);
    if (missing.length) {
      alert('Dodaj wymagane dokumenty: paszport, kartę pobytu/dowód oraz PESEL.');
      return;
    }

    setSending(true);
    try {
      for (const doc of TYPES) {
        const file = files[doc.id];
        if (!file) continue;

        await sendToMake({
          source: 'WeGoJob Portal',
          documentType: 'identity_file',
          fileType: doc.id,
          status: 'PRZESŁANO',
          employee: {
            fullName: employee.fullName || '',
            firstName: employee.firstName || '',
            surname: employee.surname || '',
            pesel: employee.pesel || '',
            passportNumber: employee.documentNumber || '',
            phone: employee.phone || '',
            email: employee.email || '',
            project: employee.project || '',
          },
          file: {
            name: file.name,
            mimeType: file.type,
            size: file.size,
            base64: file.base64,
          },
          submittedAt: new Date().toISOString(),
        });
      }

      markCompleted('photos');
      alert('Dokumenty zostały wysłane.');
    } catch (error) {
      console.error(error);
      alert('Nie udało się wysłać dokumentów. Sprawdź internet i spróbuj ponownie.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="card doc-page">
      <h2>Zdjęcia dokumentów</h2>
      <p className="hint">
        Zrób wyraźne zdjęcia. Wszystkie rogi dokumentu powinny być widoczne, a tekst czytelny.
      </p>

      <div className="upload-list">
        {TYPES.map(doc => {
          const file = files[doc.id];
          return (
            <div className="upload-card" key={doc.id}>
              <div className="upload-head">
                <strong>{doc.label}</strong>
                <span className={doc.required ? 'required-badge' : 'optional-badge'}>
                  {doc.required ? 'WYMAGANE' : 'OPCJONALNE'}
                </span>
              </div>

              {file?.base64 && (
                <img className="document-preview" src={file.base64} alt={doc.label} />
              )}

              <label className="file-button">
                {file ? 'Zmień zdjęcie' : 'Zrób zdjęcie / wybierz plik'}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  capture="environment"
                  onChange={e => selectFile(doc.id, e.target.files?.[0])}
                />
              </label>

              {file && (
                <div className="file-status">
                  ✅ {file.name}
                  <button type="button" onClick={() => setFiles(v => ({ ...v, [doc.id]: undefined }))}>
                    Usuń
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="btn primary" disabled={sending} onClick={submitAll}>
        {sending ? 'Wysyłanie…' : 'Wyślij dokumenty'}
      </button>
      <p className="hint">Pliki zostaną przekazane do Make, a następnie zapisane w Google Drive.</p>
    </section>
  );
}
