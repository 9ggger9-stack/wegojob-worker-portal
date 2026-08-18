import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad.jsx';
import { loadOnboarding } from '../services/onboardingStore.js';
import { submitPortalDocument } from '../services/documentSubmit.js';
import { generateConfidentialityPdf } from '../services/generateConfidentialityPdf.js';

const getCurrentDate = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  fullName: '',
  pesel: '',
  contract: 'Umowa zlecenia',
  city: 'Piotrków Trybunalski',
  date: getCurrentDate(),
  confirmed: false,
};

export default function Confidentiality() {
  const signatureRef = useRef(null);

  const [isSending, setIsSending] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);

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

      contract:
        onboarding.contract ||
        current.contract,

      city:
        onboarding.city ||
        current.city,
    }));
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePeselChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 11);

    updateField('pesel', value);
  };

  const validate = () => {
    if (!form.fullName.trim()) {
      alert('Uzupełnij imię i nazwisko pracownika.');
      return false;
    }

    if (form.pesel && !/^\d{11}$/.test(form.pesel)) {
      alert('Numer PESEL musi zawierać dokładnie 11 cyfr.');
      return false;
    }

    if (!form.city.trim()) {
      alert('Uzupełnij miejscowość.');
      return false;
    }

    if (!form.date) {
      alert('Wybierz datę.');
      return false;
    }

    if (!form.confirmed) {
      alert(
        'Potwierdź zapoznanie się z zasadami zachowania poufności.'
      );
      return false;
    }

    if (!signatureRef.current?.isSigned()) {
      alert('Złóż podpis pracownika.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSending(true);

      const signature =
        signatureRef.current.toDataURL();

      const normalizedData = {
        ...form,

        fullName: form.fullName.trim(),

        pesel: form.pesel
          .replace(/\D/g, '')
          .slice(0, 11),

        contract: form.contract.trim(),

        city: form.city.trim(),

        date: form.date,

        confirmed: true,
      };

      const pdf = await generateConfidentialityPdf(
        {
          fullName: normalizedData.fullName,
          pesel: normalizedData.pesel,
        },
        normalizedData,
        signature
      );

      await submitPortalDocument({
        type: 'confidentiality',
        data: normalizedData,
        signature,
        pdf,
      });

      alert(
        'Oświadczenie o zachowaniu poufności zostało poprawnie zapisane i wysłane do systemu.'
      );
    } catch (error) {
      console.error(
        'Błąd wysyłania dokumentu poufności:',
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
          <h2>Oświadczenie o zachowaniu poufności</h2>

          <p>
            Zapoznaj się z zasadami zachowania poufności
            informacji podczas wykonywania pracy.
          </p>
        </header>

        <h3>1. Dane pracownika</h3>

        <div className="form-grid">
          <label>
            Imię i nazwisko pracownika
            <input
              type="text"
              required
              autoComplete="name"
              value={form.fullName}
              onChange={(event) =>
                updateField(
                  'fullName',
                  event.target.value
                )
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
              onChange={handlePeselChange}
              placeholder="11 cyfr"
            />
          </label>

          <label>
            Rodzaj umowy
            <select
              value={form.contract}
              onChange={(event) =>
                updateField(
                  'contract',
                  event.target.value
                )
              }
            >
              <option value="Umowa zlecenia">
                Umowa zlecenia
              </option>

              <option value="Umowa o pracę">
                Umowa o pracę
              </option>

              <option value="Inna">
                Inna
              </option>
            </select>
          </label>

          <label>
            Miejscowość
            <input
              type="text"
              value={form.city}
              onChange={(event) =>
                updateField(
                  'city',
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Data
            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                updateField(
                  'date',
                  event.target.value
                )
              }
            />
          </label>
        </div>

        <h3>2. Zasady poufności</h3>

        <div className="legal long-text">
          <p>
            Pracownik zobowiązuje się do zachowania
            w tajemnicy wszelkich informacji, danych
            i dokumentów, z którymi zapoznaje się
            w związku z wykonywaniem swoich obowiązków.
          </p>

          <p>
            Obowiązek zachowania poufności obejmuje
            w szczególności dane osobowe, informacje
            dotyczące pracowników i kandydatów, klientów
            i kontrahentów, wynagrodzeń, dokumentów
            kadrowych, informacji handlowych oraz
            organizacji pracy.
          </p>

          <p>
            Pracownik zobowiązuje się nie ujawniać,
            nie rozpowszechniać ani nie wykorzystywać
            informacji poufnych do celów prywatnych
            lub innych celów niezwiązanych z wykonywaną
            pracą.
          </p>

          <p>
            Pracownik zobowiązuje się również do
            odpowiedniego zabezpieczenia dokumentów,
            danych, loginów, haseł oraz innych informacji
            przed dostępem osób nieuprawnionych.
          </p>
        </div>

        <h3>3. Potwierdzenie pracownika</h3>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.confirmed}
            onChange={(event) =>
              updateField(
                'confirmed',
                event.target.checked
              )
            }
          />

          <span>
            Potwierdzam, że zapoznałem/am się z zasadami
            zachowania poufności i zobowiązuję się
            do ich przestrzegania.
          </span>
        </label>
                <div className="signature-section">
          <label>
            Підпис працівника
          </label>

          <SignaturePad ref={signatureRef} />
        </div>

        <div className="document-confirmation">
          <p>
            Podpis pracownika potwierdza zapoznanie się
            z treścią niniejszego oświadczenia oraz
            zobowiązanie do przestrzegania zasad
            zachowania poufności.
          </p>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn primary"
            disabled={isSending}
          >
            {isSending
              ? 'Zapisywanie dokumentu...'
              : 'Podpisz i zapisz dokument'}
          </button>
        </div>
      </section>
    </form>
  );
}