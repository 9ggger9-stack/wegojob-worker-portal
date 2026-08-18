import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad.jsx';
import { loadOnboarding } from '../services/onboardingStore.js';
import { submitPortalDocument } from '../services/documentSubmit.js';
import { generatePpkPdf } from '../services/generatePpkPdf.js';

const getCurrentDate = () =>
  new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  firstName: '',
  surname: '',
  fullName: '',
  pesel: '',
  birthDate: '',
  documentNumber: '',
  employer: 'We Go Job Sp. z o.o.',
  city: 'Piotrków Trybunalski',
  date: getCurrentDate(),
  confirmed: false,
};

export default function PpkResignation() {
  const signatureRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const onboarding = loadOnboarding() || {};

    const firstName =
      onboarding.firstName || '';

    const surname =
      onboarding.surname || '';

    const fullName =
      onboarding.fullName ||
      [firstName, surname]
        .filter(Boolean)
        .join(' ');

    setForm((current) => ({
      ...current,

      firstName:
        firstName || current.firstName,

      surname:
        surname || current.surname,

      fullName:
        fullName || current.fullName,

      pesel:
        onboarding.pesel || current.pesel,

      birthDate:
        onboarding.birthDate ||
        current.birthDate,

      documentNumber:
        onboarding.documentNumber ||
        current.documentNumber,

      employer:
        onboarding.employer ||
        current.employer,

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

  const handleFirstNameChange = (event) => {
    updateField(
      'firstName',
      event.target.value.toUpperCase()
    );
  };

  const handleSurnameChange = (event) => {
    updateField(
      'surname',
      event.target.value.toUpperCase()
    );
  };

  const handlePeselChange = (event) => {
    updateField(
      'pesel',
      event.target.value
        .replace(/\D/g, '')
        .slice(0, 11)
    );
  };

  const handleDocumentNumberChange = (event) => {
    updateField(
      'documentNumber',
      event.target.value.toUpperCase()
    );
  };

  const validate = () => {
    if (!form.firstName.trim()) {
      alert('Uzupełnij imię.');
      return false;
    }

    if (!form.surname.trim()) {
      alert('Uzupełnij nazwisko.');
      return false;
    }

    if (!form.pesel.trim() && !form.birthDate) {
      alert(
        'Uzupełnij PESEL albo datę urodzenia.'
      );
      return false;
    }

    if (
      form.pesel.trim() &&
      !/^\d{11}$/.test(form.pesel)
    ) {
      alert(
        'Numer PESEL musi zawierać dokładnie 11 cyfr.'
      );
      return false;
    }

    if (!form.employer.trim()) {
      alert(
        'Uzupełnij nazwę podmiotu zatrudniającego.'
      );
      return false;
    }

    if (!form.city.trim()) {
      alert('Uzupełnij miejscowość.');
      return false;
    }

    if (!form.date) {
      alert('Wybierz datę deklaracji.');
      return false;
    }

    if (!form.confirmed) {
      alert(
        'Potwierdź zapoznanie się z treścią deklaracji.'
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

      const fullName = [
        form.firstName,
        form.surname,
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      const normalizedData = {
        ...form,
        fullName,
        firstName: form.firstName.trim(),
        surname: form.surname.trim(),
        pesel: form.pesel.trim(),
        birthDate: form.birthDate,
        documentNumber:
          form.documentNumber.trim(),
        employer: form.employer.trim(),
        city: form.city.trim(),
        date: form.date,
        confirmed: true,
      };

      const pdf = await generatePpkPdf(
        {
          fullName,
          firstName: normalizedData.firstName,
          surname: normalizedData.surname,
          pesel: normalizedData.pesel,
          documentNumber:
            normalizedData.documentNumber,
        },
        normalizedData,
        signature
      );

      await submitPortalDocument({
        type: 'ppk',
        data: normalizedData,
        signature,
        pdf,
      });

      alert(
        'Deklaracja rezygnacji z PPK została poprawnie zapisana i wysłana do systemu.'
      );
    } catch (error) {
      console.error(
        'Błąd wysyłania deklaracji PPK:',
        error
      );

      alert(
        'Nie udało się wysłać deklaracji PPK. Sprawdź połączenie z internetem i spróbuj ponownie.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="card doc-page">
        <header className="document-header">
          <h2>
            Rezygnacja z dokonywania wpłat do PPK
          </h2>

          <p>
            Deklarację należy wypełnić i złożyć
            podmiotowi zatrudniającemu.
          </p>
        </header>

        <h3>1. Dane osoby zatrudnionej</h3>

        <div className="form-grid">
          <label>
            Imię / imiona
            <input
              type="text"
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleFirstNameChange}
            />
          </label>

          <label>
            Nazwisko
            <input
              type="text"
              required
              autoComplete="family-name"
              value={form.surname}
              onChange={handleSurnameChange}
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
            Data urodzenia
            <input
              type="date"
              value={form.birthDate}
              onChange={(event) =>
                updateField(
                  'birthDate',
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Seria i numer dokumentu
            <input
              type="text"
              value={form.documentNumber}
              onChange={
                handleDocumentNumberChange
              }
              placeholder="np. ABA123456"
            />
          </label>

          <label>
            Podmiot zatrudniający
            <input
              type="text"
              value={form.employer}
              onChange={(event) =>
                updateField(
                  'employer',
                  event.target.value
                )
              }
            />
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
            Data deklaracji
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
                <h3>2. Oświadczenie o rezygnacji z PPK</h3>

        <div className="legal long-text">
          <p>
            <b>
              Oświadczam, że rezygnuję z dokonywania
              wpłat do Pracowniczych Planów
              Kapitałowych (PPK).
            </b>
          </p>

          <p>
            Mam świadomość konsekwencji złożenia
            niniejszej deklaracji, w szczególności
            tego, że w okresie obowiązywania rezygnacji
            nie będą dokonywane w moim imieniu wpłaty
            do PPK.
          </p>

          <p>
            Zostałem/am poinformowany/a o zasadach
            funkcjonowania PPK oraz o możliwości
            zmiany decyzji i ponownego rozpoczęcia
            dokonywania wpłat na zasadach określonych
            w obowiązujących przepisach.
          </p>

          <p>
            Posiadam wiedzę o konsekwencjach złożenia
            niniejszej deklaracji, w tym o:
          </p>

          <ol>
            <li>
              nieotrzymaniu wpłaty powitalnej
              w wysokości 250 zł, jeżeli nie
              nabyłem/am prawa do niej przed
              złożeniem deklaracji;
            </li>

            <li>
              nieotrzymywaniu dopłat rocznych
              do PPK w wysokości 240 zł po
              spełnieniu ustawowych warunków;
            </li>

            <li>
              nieotrzymywaniu wpłat podstawowych
              finansowanych przez podmiot
              zatrudniający w wysokości 1,5%
              wynagrodzenia.
            </li>
          </ol>

          <p>
            Potwierdzam, że dane podane w deklaracji
            są prawidłowe, a treść oświadczenia jest
            dla mnie zrozumiała.
          </p>

          <p>
            Deklarację składam dobrowolnie i mam
            świadomość skutków związanych z rezygnacją
            z dokonywania wpłat do PPK.
          </p>
        </div>

        <h3>3. Potwierdzenie</h3>

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
            Potwierdzam, że zapoznałem/am się
            z treścią deklaracji, rozumiem jej
            konsekwencje i dobrowolnie składam
            rezygnację z dokonywania wpłat do PPK.
          </span>
        </label>

        <div className="signature-section">
          <label>
            Podpis uczestnika PPK
          </label>

          <SignaturePad ref={signatureRef} />
        </div>
                <div className="document-confirmation">
          <p>
            Podpis pracownika potwierdza zapoznanie się
            z treścią deklaracji oraz dobrowolne
            złożenie rezygnacji z dokonywania wpłat
            do PPK.
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