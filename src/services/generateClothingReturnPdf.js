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

export async function generateClothingReturnPdf(
  employee = {},
  data = {},
  signature = ''
) {
  const builder = createPdfBuilder({
    title: 'PROTOKOL ZWROTU ODZIEZY I WYPOSAZENIA',
    footerTitle: 'Protokol zwrotu odziezy i wyposazenia',
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

  // TYTUŁ
  addSectionTitle(
    'PROTOKOL ZWROTU ODZIEZY I WYPOSAZENIA'
  );

  addParagraph(
    'Niniejszy protokol potwierdza zwrot przez pracownika odziezy sluzbowej oraz wyposazenia powierzonego mu w zwiazku z wykonywaniem pracy.'
  );

  addSpace(1.5);

  // 1. DANE PRACOWNIKA
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
    'Data zwrotu',
    safe(data.date)
  );

  addSpace(1.5);

  // 2. ZWRACANA ODZIEŻ I WYPOSAŻENIE
  addSectionTitle(
    '2. ZWRACANA ODZIEZ I WYPOSAZENIE'
  );

  if (!selectedItems.length) {
    addParagraph(
      'Nie wybrano zadnych pozycji do zwrotu.'
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
        'Stan',
        safe(item.condition)
      );

      addField(
        'Wartosc jednostkowa',
        money(item.price)
      );

      addField(
        'Status',
        item.returned
          ? 'ZWRÓCONO'
          : 'NIE ZWRÓCONO'
      );

      if (item.note) {
        addField(
          'Uwagi',
          safe(item.note)
        );
      }

      addSpace(0.8);
    });
  }

  addSpace(1.5);

  // 3. UWAGI
  addSectionTitle(
    '3. UWAGI DOTYCZACE ZWROTU'
  );

  addParagraph(
    safe(
      data.notes,
      'Brak dodatkowych uwag.'
    )
  );

  addSpace(1.5);

  // 4. POTWIERDZENIE ZWROTU
  addSectionTitle(
    '4. POTWIERDZENIE ZWROTU'
  );

  addParagraph(
    'Potwierdzam zwrot zaznaczonej odziezy sluzbowej i wyposazenia.'
  );

  addParagraph(
    'Oswiadczam, ze wskazane rzeczy zostaly przekazane osobie odpowiedzialnej za ich odbior.'
  );

  addParagraph(
    'Potwierdzam zgodnosc ilosci oraz stanu zwracanych rzeczy z informacjami wskazanymi w niniejszym protokole.'
  );

  addSpace(2);

  // 5. MIEJSCOWOŚĆ I DATA
  ensureSpace(80);

  addSectionTitle(
    '5. MIEJSCOWOSC I DATA'
  );

  addField(
    'Miejscowosc',
    safe(data.city)
  );

  addField(
    'Data',
    safe(data.date)
  );

  addSpace(2);

  // 6. PODPIS
  addSectionTitle(
    '6. PODPIS PRACOWNIKA'
  );

  addSignature(signature, {
    label: 'Podpis pracownika',
    width: 62,
    height: 20,
  });

  addSpace(2);

  addParagraph(
    'Podpis pracownika potwierdza zwrot wskazanej odziezy i wyposazenia oraz zapoznanie sie z trescia niniejszego protokolu.',
    {
      fontSize: 8.2,
      lineHeight: 3.8,
      marginBottom: 1,
    }
  );

  return finish();
}