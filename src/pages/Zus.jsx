import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad.jsx';
import { loadOnboarding } from '../services/onboardingStore.js';
import { submitPortalDocument } from '../services/documentSubmit.js';
import { generateZusPdf } from '../services/generateZusPdf.js';

const today = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  fullName: '',
  pesel: '',
  address: '',
  city: '',
  contract: 'Umowa zlecenia',
  payer: 'We Go Job Sp. z o.o.',
  payerAddress: '',
  otherEmployment: 'Nie',
  otherEmployer: '',
  otherSalaryMinimum: 'Nie',
  business: 'Nie',
  businessBasis: '',
  otherInsurance: 'Nie',
  otherInsuranceDetails: '',
  pension: 'Nie',
  pensionDetails: '',
  unemployed: 'Nie',
  student: 'Nie',
  studyMode: 'Dzienny',
  school: '',
  sicknessInsurance: 'Nie',
  date: today(),
};

function YesNo({ label, value, onChange }) {
  return (
    <fieldset className="zus-choice">
      <legend>{label}</legend>
      <label>
        <input
          type="radio"
          value="Tak"
          checked={value === 'Tak'}
          onChange={(e) => onChange(e.target.value)}
        />
        Tak
      </label>
      <label>
        <input
          type="radio"
          value="Nie"
          checked={value === 'Nie'}
          onChange={(e) => onChange(e.target.value)}
        />
        Nie
      </label>
    </fieldset>
  );
}

export default function Zus() {
  const signatureRef = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const onboarding = loadOnboarding() || {};
    const fullName =
      onboarding.fullName ||
      [onboarding.firstName, onboarding.surname].filter(Boolean).join(' ');

    const address =
      onboarding.address ||
      [
        onboarding.street,
        onboarding.houseNumber,
        onboarding.apartmentNumber ? `/${onboarding.apartmentNumber}` : '',
        onboarding.postalCode,
        onboarding.city,
      ]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

    setForm((current) => ({
      ...current,
      fullName: fullName || current.fullName,
      pesel: onboarding.pesel || current.pesel,
      address: address || current.address,
      city: onboarding.city || current.city,
    }));
  }, []);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) {
      alert('Uzupełnij imię i nazwisko.');
      return false;
    }
    if (!/^\d{11}$/.test(form.pesel)) {
      alert('Numer PESEL musi zawierać dokładnie 11 cyfr.');
      return false;
    }
    if (!form.address.trim()) {
      alert('Uzupełnij adres zamieszkania.');
      return false;
    }
    if (!form.city.trim()) {
      alert('Uzupełnij miejscowość.');
      return false;
    }
    if (form.otherEmployment === 'Tak' && !form.otherEmployer.trim()) {
      alert('Uzupełnij dane innego pracodawcy lub zleceniodawcy.');
      return false;
    }
    if (form.otherInsurance === 'Tak' && !form.otherInsuranceDetails.trim()) {
      alert('Uzupełnij informacje o innym tytule do ubezpieczeń.');
      return false;
    }
    if (form.pension === 'Tak' && !form.pensionDetails.trim()) {
      alert('Uzupełnij informacje dotyczące emerytury lub renty.');
      return false;
    }
    if (form.student === 'Tak' && !form.school.trim()) {
      alert('Uzupełnij nazwę szkoły lub uczelni.');
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
    if (!validate()) return;

    try {
      setIsSending(true);
      const signature = signatureRef.current.toDataURL();

      const data = {
        ...form,
        fullName: form.fullName.trim(),
        pesel: form.pesel.replace(/\D/g, '').slice(0, 11),
        address: form.address.trim(),
        city: form.city.trim(),
        otherEmployer: form.otherEmployer.trim(),
        businessBasis: form.businessBasis.trim(),
        otherInsuranceDetails: form.otherInsuranceDetails.trim(),
        pensionDetails: form.pensionDetails.trim(),
        school: form.school.trim(),
      };

      const pdf = await generateZusPdf(
        { fullName: data.fullName, pesel: data.pesel },
        data,
        signature
      );

      await submitPortalDocument({
        type: 'zus',
        data,
        signature,
        pdf,
      });

      alert('Oświadczenie ZUS zostało zapisane i wysłane.');
    } catch (error) {
      console.error(error);
      alert('Nie udało się wysłać dokumentu.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="card doc-page">
        <header className="document-header">
          <h2>Oświadczenie zleceniobiorcy do celów ZUS</h2>
          <p>
            Dane potrzebne do ustalenia prawidłowego zakresu
            ubezpieczeń społecznych i zdrowotnych.
          </p>
        </header>

        <h3>1. Dane zleceniobiorcy</h3>
        <div className="form-grid">
          <label>
            Imię i nazwisko
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              required
            />
          </label>

          <label>
            PESEL
            <input
              type="text"
              inputMode="numeric"
              maxLength={11}
              value={form.pesel}
              onChange={(e) =>
                update('pesel', e.target.value.replace(/\D/g, '').slice(0, 11))
              }
              required
            />
          </label>

          <label className="full">
            Adres zamieszkania
            <input
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              required
            />
          </label>

          <label>
            Miejscowość
            <input
              type="text"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              required
            />
          </label>

          <label>
            Rodzaj umowy
            <select
              value={form.contract}
              onChange={(e) => update('contract', e.target.value)}
            >
              <option value="Umowa zlecenia">Umowa zlecenia</option>
              <option value="Umowa o pracę">Umowa o pracę</option>
              <option value="Inna">Inna</option>
            </select>
          </label>
        </div>

        <h3>2. Inne zatrudnienie</h3>
        <YesNo
          label="Czy wykonujesz pracę na podstawie innej umowy?"
          value={form.otherEmployment}
          onChange={(value) => update('otherEmployment', value)}
        />

        {form.otherEmployment === 'Tak' && (
          <label>
            Nazwa pracodawcy lub zleceniodawcy
            <input
              type="text"
              value={form.otherEmployer}
              onChange={(e) => update('otherEmployer', e.target.value)}
            />
          </label>
        )}

        <YesNo
          label="Czy podstawa składek z innego zatrudnienia wynosi co najmniej minimalne wynagrodzenie?"
          value={form.otherSalaryMinimum}
          onChange={(value) => update('otherSalaryMinimum', value)}
        />

        <h3>3. Działalność gospodarcza</h3>
        <YesNo
          label="Czy prowadzisz działalność gospodarczą?"
          value={form.business}
          onChange={(value) => update('business', value)}
        />

        {form.business === 'Tak' && (
          <label>
            Informacja o podstawie składek
            <input
              type="text"
              value={form.businessBasis}
              onChange={(e) => update('businessBasis', e.target.value)}
            />
          </label>
        )}

        <h3>4. Inne tytuły do ubezpieczeń</h3>
        <YesNo
          label="Czy posiadasz inny tytuł do ubezpieczeń społecznych?"
          value={form.otherInsurance}
          onChange={(value) => update('otherInsurance', value)}
        />

        {form.otherInsurance === 'Tak' && (
          <label>
            Szczegóły innego tytułu
            <input
              type="text"
              value={form.otherInsuranceDetails}
              onChange={(e) => update('otherInsuranceDetails', e.target.value)}
            />
          </label>
        )}

        <YesNo
          label="Czy masz ustalone prawo do emerytury lub renty?"
          value={form.pension}
          onChange={(value) => update('pension', value)}
        />

        {form.pension === 'Tak' && (
          <label>
            Rodzaj i szczegóły świadczenia
            <input
              type="text"
              value={form.pensionDetails}
              onChange={(e) => update('pensionDetails', e.target.value)}
            />
          </label>
        )}

        <YesNo
          label="Czy jesteś zarejestrowany/a jako osoba bezrobotna?"
          value={form.unemployed}
          onChange={(value) => update('unemployed', value)}
        />

        <h3>5. Status ucznia lub studenta</h3>
        <YesNo
          label="Czy posiadasz status ucznia, studenta lub słuchacza?"
          value={form.student}
          onChange={(value) => update('student', value)}
        />

        {form.student === 'Tak' && (
          <div className="form-grid">
            <label>
              Tryb nauki
              <select
                value={form.studyMode}
                onChange={(e) => update('studyMode', e.target.value)}
              >
                <option value="Dzienny">Dzienny</option>
                <option value="Zaoczny">Zaoczny</option>
                <option value="Wieczorowy">Wieczorowy</option>
                <option value="Inny">Inny</option>
              </select>
            </label>

            <label>
              Nazwa szkoły lub uczelni
              <input
                type="text"
                value={form.school}
                onChange={(e) => update('school', e.target.value)}
              />
            </label>
          </div>
        )}

        <h3>6. Dobrowolne ubezpieczenie chorobowe</h3>
        <YesNo
          label="Czy wnioskujesz o objęcie dobrowolnym ubezpieczeniem chorobowym?"
          value={form.sicknessInsurance}
          onChange={(value) => update('sicknessInsurance', value)}
        />

        <h3>7. Oświadczenie</h3>
        <div className="legal">
          <p>
            Oświadczam, że wszystkie podane informacje są zgodne ze
            stanem faktycznym i kompletne.
          </p>
          <p>
            Zobowiązuję się niezwłocznie poinformować płatnika składek
            o każdej zmianie danych mającej wpływ na obowiązek
            ubezpieczeń społecznych i zdrowotnych.
          </p>
        </div>

        <label>
          Data
          <input
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            required
          />
        </label>

        <div className="signature-section">
          <label>Podpis pracownika</label>
          <SignaturePad ref={signatureRef} />
        </div>

        <button
          type="submit"
          className="btn primary"
          disabled={isSending}
        >
          {isSending ? 'Zapisywanie dokumentu...' : 'Podpisz i zapisz dokument'}
        </button>
      </section>
    </form>
  );
}
