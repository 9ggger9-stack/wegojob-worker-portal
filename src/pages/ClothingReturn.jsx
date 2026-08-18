import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad.jsx';
import { loadOnboarding } from '../services/onboardingStore.js';
import { submitPortalDocument } from '../services/documentSubmit.js';
import { generateClothingReturnPdf } from '../services/generateClothingReturnPdf.js';

const getCurrentDate = () =>
  new Date().toISOString().slice(0, 10);

const GOODS = [
  ['Koszulka', 60],
  ['Polar', 90],
  ['Spodnie', 90],
  ['Buty', 140],
  ['Kamizelka', 40],
  ['Klucz', 100],
  ['Karta', 100],
];

const createItems = () =>
  GOODS.map(([name, price]) => ({
    name,
    price,
    selected: false,
    qty: 1,
    size: '',
    condition: 'Dobry',
    returned: true,
    note: '',
  }));

export default function ClothingReturn() {
  const signatureRef = useRef(null);

  const [employee, setEmployee] = useState({});
  const [items, setItems] = useState(createItems);
  const [city, setCity] = useState('Piotrków Trybunalski');
  const [date, setDate] = useState(getCurrentDate());
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const onboarding = loadOnboarding() || {};

    setEmployee(onboarding);

    if (onboarding.city) {
      setCity(onboarding.city);
    }
  }, []);

  const fullName =
    employee.fullName ||
    `${employee.firstName || ''} ${
      employee.surname || ''
    }`.trim();

  const updateItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const toggleSelected = (index) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              selected: !item.selected,
            }
          : item
      )
    );
  };

  const validate = () => {
    const selectedItems = items.filter(
      (item) => item.selected
    );

    if (!fullName) {
      alert(
        'Brak danych pracownika. Najpierw uzupełnij kwestionariusz osobowy.'
      );
      return false;
    }

    if (!selectedItems.length) {
      alert(
        'Zaznacz co najmniej jedną rzecz do zwrotu.'
      );
      return false;
    }

    const notReturned = selectedItems.some(
      (item) => !item.returned
    );

    if (notReturned) {
      alert(
        'Każda zaznaczona pozycja musi być oznaczona jako zwrócona.'
      );
      return false;
    }

    const invalidQuantity = selectedItems.some(
      (item) =>
        !Number.isInteger(Number(item.qty)) ||
        Number(item.qty) < 1
    );

    if (invalidQuantity) {
      alert(
        'Ilość każdej zwracanej rzeczy musi wynosić co najmniej 1.'
      );
      return false;
    }

    if (!city.trim()) {
      alert('Uzupełnij miejscowość.');
      return false;
    }

    if (!date) {
      alert('Wybierz datę zwrotu.');
      return false;
    }

    if (!confirmed) {
      alert(
        'Potwierdź zwrot wskazanych rzeczy.'
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

      const selectedItems = items
        .filter((item) => item.selected)
        .map((item) => ({
          ...item,
          qty: Number(item.qty),
        }));

      const data = {
        ...employee,
        fullName,
        city: city.trim(),
        date,
        notes: notes.trim(),
        confirmed: true,
        items: selectedItems,
      };

      const pdf =
        await generateClothingReturnPdf(
          employee,
          data,
          signature
        );

      await submitPortalDocument({
        type: 'clothing_return',
        data,
        signature,
        pdf,
      });

      alert(
        'Protokół zwrotu został poprawnie zapisany i wysłany do systemu.'
      );
    } catch (error) {
      console.error(
        'Błąd wysyłania protokołu zwrotu:',
        error
      );

      alert(
        'Nie udało się wysłać protokołu zwrotu. Sprawdź połączenie z internetem i spróbuj ponownie.'
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
            Protokół zwrotu odzieży i wyposażenia
          </h2>

          <p>
            Zaznacz rzeczy zwracane przez pracownika,
            określ ich stan i podpisz protokół.
          </p>
        </header>

        <h3>1. Dane pracownika</h3>

        <div className="form-grid">
          <label>
            Imię i nazwisko
            <input
              type="text"
              value={fullName}
              readOnly
            />
          </label>

          <label>
            PESEL
            <input
              type="text"
              value={employee.pesel || ''}
              readOnly
            />
          </label>

          <label>
            Miejscowość
            <input
              type="text"
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
            />
          </label>

          <label>
            Data zwrotu
            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />
          </label>
        </div>

        <h3>2. Zwracana odzież i wyposażenie</h3>
                <div className="goods-list">
          {items.map((item, index) => (
            <div
              className="goods-row"
              key={item.name}
            >
              <label className="goods-check">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() =>
                    toggleSelected(index)
                  }
                />

                <strong>{item.name}</strong>
              </label>

              <label>
                Ilość
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.qty}
                  disabled={!item.selected}
                  onChange={(event) =>
                    updateItem(
                      index,
                      'qty',
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Rozmiar
                <input
                  type="text"
                  placeholder="np. M / 42"
                  value={item.size}
                  disabled={!item.selected}
                  onChange={(event) =>
                    updateItem(
                      index,
                      'size',
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Stan
                <select
                  value={item.condition}
                  disabled={!item.selected}
                  onChange={(event) =>
                    updateItem(
                      index,
                      'condition',
                      event.target.value
                    )
                  }
                >
                  <option value="Dobry">
                    Dobry
                  </option>

                  <option value="Lekko zużyty">
                    Lekko zużyty
                  </option>

                  <option value="Zużyty">
                    Zużyty
                  </option>

                  <option value="Uszkodzony">
                    Uszkodzony
                  </option>

                  <option value="Brak">
                    Brak
                  </option>
                </select>
              </label>

              <label className="goods-return">
                <input
                  type="checkbox"
                  checked={item.returned}
                  disabled={!item.selected}
                  onChange={(event) =>
                    updateItem(
                      index,
                      'returned',
                      event.target.checked
                    )
                  }
                />

                <span>
                  Zwrócono
                </span>
              </label>

              <label>
                Uwagi
                <input
                  type="text"
                  placeholder="Opcjonalnie"
                  value={item.note}
                  disabled={!item.selected}
                  onChange={(event) =>
                    updateItem(
                      index,
                      'note',
                      event.target.value
                    )
                  }
                />
              </label>
            </div>
          ))}
        </div>

        <h3>3. Uwagi dotyczące zwrotu</h3>

        <label>
          Uwagi ogólne
          <textarea
            rows="4"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Np. odzież zwrócona w dobrym stanie..."
          />
        </label>

        <h3>4. Potwierdzenie zwrotu</h3>

        <div className="legal long-text">
          <p>
            Potwierdzam zwrot zaznaczonej odzieży
            służbowej i wyposażenia.
          </p>

          <p>
            Oświadczam, że wskazane rzeczy zostały
            przekazane osobie odpowiedzialnej za ich
            odbiór.
          </p>

          <p>
            Potwierdzam zgodność ilości oraz stanu
            zwracanych rzeczy z informacjami wskazanymi
            w niniejszym protokole.
          </p>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) =>
              setConfirmed(
                event.target.checked
              )
            }
          />

          <span>
            Potwierdzam, że zwróciłem/am zaznaczoną
            odzież i wyposażenie oraz zapoznałem/am się
            z treścią protokołu.
          </span>
        </label>

        <h3>5. Podpis pracownika</h3>

        <div className="signature-section">
          <label>
            Podpis pracownika
          </label>

          <SignaturePad ref={signatureRef} />
        </div>
                <div className="document-confirmation">
          <p>
            Podpis pracownika potwierdza zwrot
            wskazanej odzieży i wyposażenia oraz
            zapoznanie się z treścią protokołu.
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