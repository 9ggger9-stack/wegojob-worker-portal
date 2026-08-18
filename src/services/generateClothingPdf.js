import { createPdfBuilder } from './pdfBuilder.js';

const safe = (value, fallback = '-') => {
  const result = String(value ?? '').trim();
  return result || fallback;
};

const money = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return '-';
  }

  return `${number.toFixed(2).replace('.', ',')} PLN`;
};

export async function generateClothingPdf(
  employee = {},
  data = {},
  signature = ''
) {
  const builder = createPdfBuilder({
    title: 'PROTOKOL OTRZYMANIA ODZIEZY I WYPOSAZENIA',
    footerTitle: 'Protokol otrzymania odziezy i wyposazenia',
  });

  const {
    addSectionTitle,
    addField,
    addParagraph,
    addSpace,
    ensureSpace,
    addSignature,
    finish,
  } = builder;

  const fullName =
    data.fullName ||
    employee.fullName ||
    `${employee.firstName || ''} ${employee.surname || ''}`.trim();

  const items = Array.isArray(data.items)
    ? data.items
    : [];

  const selectedItems = items.filter(
    (item) => item?.selected !== false
  );

  addSectionTitle(
    'PROTOKOL OTRZYMANIA ODZIEZY I WYPOSAZENIA'
  );

  addParagraph(
    'Niniejszy protokol potwierdza otrzymanie przez pracownika odziezy sluzbowej oraz wyposazenia niezbednego do wykonywania pracy.'
  );

  addSpace(1.5);

  addSectionTitle('1. DANE PRACOWNIKA');

  addField(
    'Imie i nazwisko',
    safe(fullName)
  );

  addField(
    'PESEL',
    safe(data.pesel || employee.pesel)
  );

  addField(
    'Stanowisko / projekt',
    safe(data.project || employee.project)
  );

  addField(
    'Miejscowosc',
    safe(data.city)
  );

  addField(
    'Data otrzymania',
    safe(data.date)
  );

  addSpace(1.5);

  addSectionTitle(
    '2. OTRZYMANA ODZIEZ I WYPOSAZENIE'
  );

  if (!selectedItems.length) {
    addParagraph(
      'Nie wybrano zadnych pozycji.'
    );
  } else {
    selectedItems.forEach((item, index) => {
      addField(
        `${index + 1}. Pozycja`,
        safe(item.name)
      );

      addField(
        'Ilosc',
        safe(item.qty, '1')
      );

      addField(
        'Rozmiar',
        safe(item.size)
      );

      addField(
        'Wartosc jednostkowa',
        money(item.price)
      );

      addField(
        'Status',
        item.returned
          ? 'ZWRÓCONO'
          : 'W UZYTKOWANIU'
      );

      addSpace(0.8);
    });
  }

  addSpace(1.5);

  addSectionTitle(
    '3. OSWIADCZENIE PRACOWNIKA'
  );

  addParagraph(
    'Potwierdzam otrzymanie odziezy i wyposazenia wskazanych w niniejszym protokole.'
  );

  addParagraph(
    'Oswiadczam, ze otrzymane rzeczy beda przeze mnie wykorzystywane zgodnie z ich przeznaczeniem oraz zasadami obowiazujacymi w miejscu wykonywania pracy.'
  );

  addParagraph(
    'Zobowiazuje sie do dbania o powierzone rzeczy oraz do ich zwrotu w przypadku zakonczenia pracy lub na zadanie osoby uprawnionej.'
  );

  addSpace(1.5);

  addSectionTitle(
    '4. POTRACENIE NALEZNOSCI'
  );

  addParagraph(
    'Zgodnie z art. 91 Kodeksu pracy wyrazam zgode na dokonanie potracenia naleznosci z wynagrodzenia za nierozliczona odziez lub wyposazenie, w zakresie dopuszczalnym przez obowiazujace przepisy prawa.'
  );

  addParagraph(
    'Potwierdzam, ze zostalem/am poinformowany/a o obowiazku zwrotu powierzonej odziezy i wyposazenia.'
  );

  addSpace(2);

  ensureSpace(80);

  addSectionTitle('5. MIEJSCOWOSC I DATA');

  addField(
    'Miejscowosc',
    safe(data.city)
  );

  addField(
    'Data',
    safe(data.date)
  );

  addSpace(2);

  addSectionTitle('6. PODPIS PRACOWNIKA');

  addSignature(signature, {
    label: 'Podpis pracownika',
    width: 62,
    height: 20,
  });

  addSpace(2);

  addParagraph(
    'Podpis pracownika potwierdza otrzymanie wskazanej odziezy i wyposazenia oraz zapoznanie sie z zasadami ich uzytkowania i zwrotu.',
    {
      fontSize: 8.2,
      lineHeight: 3.8,
      marginBottom: 1,
    }
  );

  return finish();
}