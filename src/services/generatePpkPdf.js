import { createPdfBuilder } from './pdfBuilder.js';

const safe = (value, fallback = '-') => {
  const result = String(value ?? '').trim();
  return result || fallback;
};

export async function generatePpkPdf(
  employee = {},
  data = {},
  signature = ''
) {
  const builder = createPdfBuilder({
    title: 'DEKLARACJA REZYGNACJI Z DOKONYWANIA WPLAT DO PPK',
    footerTitle: 'Rezygnacja z dokonywania wpłat do PPK',
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
    `${employee.firstName || ''} ${
      employee.surname || ''
    }`.trim();

  addSectionTitle(
    'DEKLARACJA REZYGNACJI Z DOKONYWANIA WPLAT DO PPK'
  );

  addParagraph(
    'Deklaracje nalezy wypelnic i zlozyc podmiotowi zatrudniajacemu. Pracownik potwierdza, ze rozumie skutki zlozenia deklaracji rezygnacji z dokonywania wplat do PPK.',
    {
      fontSize: 8.5,
      lineHeight: 3.9,
      marginBottom: 2,
    }
  );

  addSpace(1.5);

  addSectionTitle('1. DANE OSOBY ZATRUDNIONEJ');

  addField(
    'Imie / imiona',
    safe(data.firstName || employee.firstName)
  );

  addField(
    'Nazwisko',
    safe(data.surname || employee.surname)
  );

  addField(
    'PESEL',
    safe(data.pesel || employee.pesel)
  );

  addField(
    'Data urodzenia (brak PESEL)',
    safe(data.birthDate)
  );

  addField(
    'Seria i numer dokumentu',
    safe(data.documentNumber || employee.documentNumber)
  );

  addSpace(1.5);

  addSectionTitle('2. PODMIOT ZATRUDNIAJACY');

  addField(
    'Podmiot zatrudniajacy',
    safe(
      data.employer,
      'We Go Job Sp. z o.o.'
    )
  );

  addField(
    'Data deklaracji',
    safe(data.date)
  );

  addSpace(1.5);

  addSectionTitle('3. OSWIADCZENIE O REZYGNACJI');

  addParagraph(
    'Oswiadczam, ze rezygnuje z dokonywania w moim imieniu wplat do Pracowniczych Planow Kapitalowych (PPK).'
  );

  addParagraph(
    'Mam swiadomosc konsekwencji zlozenia niniejszej deklaracji, w szczegolnosci tego, ze w okresie obowiazywania rezygnacji nie beda dokonywane w moim imieniu wplaty do PPK.'
  );

  addParagraph(
    'Zostalem/am poinformowany/a o zasadach funkcjonowania PPK oraz o mozliwosci zmiany decyzji i ponownego rozpoczecia dokonywania wplat na zasadach okreslonych w obowiazujacych przepisach.'
  );

  addSpace(1.5);

  addSectionTitle('4. KONSEKWENCJE REZYGNACJI');

  addParagraph(
    'Oswiadczam, ze posiadam wiedze o konsekwencjach zlozenia niniejszej deklaracji, w tym o:'
  );

  addParagraph(
    '1) nieotrzymaniu wplaty powitalnej w wysokosci 250 zl, jezeli nie nabylem/am prawa do niej przed zlozeniem deklaracji;'
  );

  addParagraph(
    '2) nieotrzymywaniu doplat rocznych do PPK w wysokosci 240 zl po spelnieniu ustawowych warunkow;'
  );

  addParagraph(
    '3) nieotrzymywaniu wplat podstawowych finansowanych przez podmiot zatrudniajacy w wysokosci 1,5% wynagrodzenia.'
  );

  addSpace(1.5);

  addSectionTitle('5. POTWIERDZENIE');

  addParagraph(
    'Potwierdzam, ze dane podane w deklaracji sa prawidlowe, a tresc oswiadczenia jest dla mnie zrozumiala.'
  );

  addParagraph(
    'Deklaracje skladam dobrowolnie i mam swiadomosc skutkow prawnych i finansowych zwiazanych z rezygnacja z dokonywania wplat do PPK.'
  );

  addSpace(2);

  ensureSpace(80);
    addSectionTitle('6. MIEJSCOWOSC I PODPIS');

  addField(
    'Miejscowosc',
    safe(data.city, 'Piotrków Trybunalski'),
    {
      minHeight: 9,
    }
  );

  addField(
    'Data',
    safe(data.date)
  );

  addSpace(2);

  addSectionTitle('7. PODPIS UCZESTNIKA PPK', {
    keepWithNext: 36,
  });

  addSignature(signature, {
    label: 'Podpis uczestnika PPK',
    width: 62,
    height: 20,
  });

  return finish();
}