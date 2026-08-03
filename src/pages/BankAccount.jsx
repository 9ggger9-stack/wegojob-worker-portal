import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad.jsx';
import { loadOnboarding } from '../services/onboardingStore.js';
import { submitPortalDocument } from '../services/documentSubmit.js';
import { generateBankAccountPdf } from '../services/generateBankAccountPdf.js';
const getCurrentDate = () => new Date().toISOString().slice(0, 10);

const normalizeIban = (value = '') =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

const formatIban = (value = '') =>
  normalizeIban(value)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const isValidPolishAccount = (value = '') => {
  const normalized = normalizeIban(value);

  // Польський номер рахунку без PL — 26 цифр
  if (/^\d{26}$/.test(normalized)) {
    return true;
  }

  // Польський IBAN — PL + 26 цифр
  return /^PL\d{26}$/.test(normalized);
};

export default function BankAccount() {
  const signatureRef = useRef(null);

  const [isSending, setIsSending] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    pesel: '',
    contract: 'Umowa zlecenia',
    accountHolder: '',
    bankName: '',
    iban: '',
    city: 'Piotrków Trybunalski',
    date: getCurrentDate(),
  });

  useEffect(() => {
    const onboarding = loadOnboarding() || {};

    const fullName =
      onboarding.fullName ||
      [onboarding.firstName, onboarding.surname]
        .filter(Boolean)
        .join(' ');

    setForm((current) => ({
      ...current,
      fullName: fullName || current.fullName,
      pesel: onboarding.pesel || current.pesel,
      accountHolder:
        onboarding.accountHolder ||
        fullName ||
        current.accountHolder,
    }));
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleIbanChange = (event) => {
    const value = normalizeIban(event.target.value).slice(0, 28);

    updateField('iban', value);
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!form.fullName.trim()) {
    alert('Uzupełnij imię i nazwisko pracownika.');
    return;
  }

  if (!form.accountHolder.trim()) {
    alert('Uzupełnij imię i nazwisko właściciela rachunku.');
    return;
  }

  if (!form.bankName.trim()) {
    alert('Uzupełnij nazwę banku.');
    return;
  }

  if (!isValidPolishAccount(form.iban)) {
    alert(
      'Wpisz poprawny polski numer rachunku: 26 cyfr lub PL oraz 26 cyfr.'
    );
    return;
  }

  if (!signatureRef.current?.isSigned()) {
    alert('Złóż podpis pracownika.');
    return;
  }

  try {
    setIsSending(true);

    const signature = signatureRef.current.toDataURL();

    const normalizedData = {
      ...form,
      iban: normalizeIban(form.iban),
    };

    const pdf = await generateBankAccountPdf(
      {
        fullName: normalizedData.fullName,
        pesel: normalizedData.pesel,
      },
      normalizedData,
      signature
    );

    await submitPortalDocument({
      type: 'bank',
      data: normalizedData,
      signature,
      pdf,
    });

    alert(
      'Dokument został poprawnie zapisany i wysłany do systemu.'
    );
  } catch (error) {
    console.error(
      'Błąd wysyłania dokumentu bankowego:',
      error
    );

    alert(
      'Nie udało się wysłać dokumentu. Sprawdź połączenie z internetem i spróbuj ponownie.'
    );
  } finally {
    setIsSending(false);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <section className="card doc-page">
        <header className="document-header">
          <h2>Dyspozycja przelewu wynagrodzenia</h2>

          <p>
            Proszę o przekazywanie wynagrodzenia na wskazany poniżej
            rachunek bankowy.
          </p>
        </header>

        <div className="form-grid">
          <label>
            Imię i nazwisko pracownika
            <input
              type="text"
              required
              autoComplete="name"
              value={form.fullName}
              onChange={(event) =>
                updateField('fullName', event.target.value)
              }
            />
          </label>

          <label>
            PESEL
            <input
              type="text"
              inputMode="numeric"
              maxLength={11}
              value={form.pesel}
              onChange={(event) =>
                updateField(
                  'pesel',
                  event.target.value.replace(/\D/g, '').slice(0, 11)
                )
              }
            />
          </label>

          <label>
            Rodzaj umowy
            <select
              value={form.contract}
              onChange={(event) =>
                updateField('contract', event.target.value)
              }
            >
              <option value="Umowa zlecenia">
                Umowa zlecenia
              </option>

              <option value="Umowa o pracę">
                Umowa o pracę
              </option>
            </select>
          </label>

          <label>
            Nazwa banku
            <input
              type="text"
              required
              value={form.bankName}
              onChange={(event) =>
                updateField('bankName', event.target.value)
              }
              placeholder="np. Santander Bank Polska"
            />
          </label>

          <label className="full">
            Imię i nazwisko właściciela rachunku
            <input
              type="text"
              required
              value={form.accountHolder}
              onChange={(event) =>
                updateField('accountHolder', event.target.value)
              }
            />
          </label>

          <label className="full">
            Numer rachunku bankowego / IBAN
            <input
              type="text"
              required
              inputMode="text"
              autoComplete="off"
              value={formatIban(form.iban)}
              onChange={handleIbanChange}
              placeholder="PL00 0000 0000 0000 0000 0000 0000"
            />

            <small>
              Wpisz 26 cyfr albo symbol PL i 26 cyfr.
            </small>
          </label>

          <label>
            Miejscowość
            <input
              type="text"
              required
              value={form.city}
              onChange={(event) =>
                updateField('city', event.target.value)
              }
            />
          </label>

          <label>
            Data
            <input
              type="date"
              required
              value={form.date}
              onChange={(event) =>
                updateField('date', event.target.value)
              }
            />
          </label>
        </div>

        <div className="legal">
          <p>
            Wyrażam zgodę na przekazywanie przez We Go Job Sp. z o.o.
            mojego wynagrodzenia z tytułu wskazanej umowy przelewem na
            podany przeze mnie rachunek bankowy.
          </p>

          <p>
            Oświadczam, że podane dane oraz numer rachunku bankowego są
            prawidłowe. Zobowiązuję się poinformować pracodawcę lub
            zleceniodawcę o każdej zmianie numeru rachunku bankowego.
          </p>
        </div>

        <div className="signature-section">
          <label>Podpis pracownika</label>

          <SignaturePad ref={signatureRef} />
        </div>

        <button
          type="submit"
          className="btn primary"
          disabled={isSending}
        >
          {isSending
            ? 'Zapisywanie dokumentu...'
            : 'Podpisz i zapisz dokument'}
        </button>
      </section>
    </form>
  );
}