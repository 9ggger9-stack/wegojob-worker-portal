import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from '../components/SignaturePad.jsx';
import { loadOnboarding } from '../services/onboardingStore.js';
import { submitPortalDocument } from '../services/documentSubmit.js';
import { generateClothingPdf } from '../services/generateClothingPdf.js';
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
    issued: true,
    returned: false,
  }));

export default function Clothing() {
  const signatureRef = useRef(null);

  const [employee, setEmployee] = useState({});
  const [items, setItems] = useState(createItems);
  const [city, setCity] = useState('Piotrków Trybunalski');
  const [date, setDate] = useState(getCurrentDate());
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

  const toggleReturned = (index) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              returned: !item.returned,
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
        'Zaznacz co najmniej jedną wydaną rzecz.'
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
        'Ilość każdej wydanej rzeczy musi wynosić co najmniej 1.'
      );
      return false;
    }

    if (!city.trim()) {
      alert('Uzupełnij miejscowość.');
      return false;
    }

    if (!date) {
      alert('Wybierz datę.');
      return false;
    }

    if (!confirmed) {
      alert(
        'Potwierdź zapoznanie się z zasadami użytkowania i zwrotu odzieży.'
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
        confirmed: true,
        items: selectedItems,
      };

      const hasReturnedItems = selectedItems.some(
  (item) => item.returned
);

const pdf = hasReturnedItems
  ? await generateClothingReturnPdf(
      employee,
      data,
      signature
    )
  : await generateClothingPdf(
      employee,
      data,
      signature
    );

await submitPortalDocument({
  type: hasReturnedItems
    ? 'clothing_return'
    : 'clothing',
  data,
  signature,
  pdf,
});

      alert(
        'Protokół odzieży został poprawnie zapisany i wysłany do systemu.'
      );
    } catch (error) {
      console.error(
        'Błąd wysyłania protokołu odzieży:',
        error
      );

      alert(
        'Nie udało się wysłać protokołu. Sprawdź połączenie z internetem i spróbuj ponownie.'
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
            Protokół odzieży służbowej
          </h2>

          <p>
            Wybierz rzeczy wydane pracownikowi,
            określ ilość i rozmiar, a następnie
            podpisz protokół.
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
            Data wydania
            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />
          </label>
        </div>
                <h3>2. Odzież i wyposażenie</h3>

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

              <div className="goods-price">
                <span>
                  Cena
                </span>

                <strong>
                  {item.price} zł
                </strong>
              </div>

              <label className="goods-return">
                <input
                  type="checkbox"
                  checked={item.returned}
                  disabled={!item.selected}
                  onChange={() =>
                    toggleReturned(index)
                  }
                />

                <span>
                  Zwrócono
                </span>
              </label>
            </div>
          ))}
        </div>

        <h3>3. Oświadczenie pracownika</h3>

        <div className="legal long-text">
          <p>
            Potwierdzam odbiór zaznaczonej odzieży
            służbowej i wyposażenia.
          </p>

          <p>
            Zobowiązuję się do korzystania z powierzonej
            odzieży i wyposażenia zgodnie z ich
            przeznaczeniem oraz zasadami obowiązującymi
            w miejscu wykonywania pracy.
          </p>

          <p>
            Zobowiązuję się do dbania o powierzone
            rzeczy oraz ich zwrotu po zakończeniu
            pracy lub na żądanie osoby uprawnionej.
          </p>

          <p>
            Zgodnie z art. 91 Kodeksu pracy wyrażam
            zgodę na dokonanie potrącenia należności
            z wynagrodzenia za nierozliczoną odzież
            lub wyposażenie, w zakresie dopuszczalnym
            przez obowiązujące przepisy prawa.
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
            Potwierdzam, że zapoznałem/am się
            z zasadami użytkowania, zabezpieczenia
            i zwrotu powierzonej odzieży oraz
            wyposażenia.
          </span>
        </label>

        <h3>4. Podpis pracownika</h3>

        <div className="signature-section">
          <label>
            Podpis pracownika
          </label>

          <SignaturePad ref={signatureRef} />
        </div>
                <div className="document-confirmation">
          <p>
            Podpis pracownika potwierdza odbiór
            wskazanej odzieży i wyposażenia oraz
            zapoznanie się z zasadami ich użytkowania
            i zwrotu.
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