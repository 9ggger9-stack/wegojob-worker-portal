import { createPdfBuilder } from './pdfBuilder.js';

const formatAccountNumber = (value = '') => {
  const normalized = String(value)
    .toUpperCase()
    .replace(/\s/g, '');

  return normalized
    .replace(/(.{4})/g, '$1 ')
    .trim();
};

export async function generateBankAccountPdf(
  employee = {},
  data = {},
  signature = ''
) {
  const builder = createPdfBuilder({
    title: 'DYSPOZYCJA PRZELEWU WYNAGRODZENIA',
    footerTitle: 'Dyspozycja przelewu wynagrodzenia',
  });

  const {
    addSectionTitle,
    addField,
    addParagraph,
    addSignature,
    addSpace,
    finish,
  } = builder;

  const fullName =
    data.fullName ||
    employee.fullName ||
    `${employee.firstName || ''} ${
      employee.surname || ''
    }`.trim();

  addSectionTitle('1. DANE PRACOWNIKA');

  addField(
    'Imie i nazwisko',
    fullName
  );

  addField(
    'PESEL',
    data.pesel || employee.pesel
  );

  addField(
    'Rodzaj umowy',
    data.contract
  );

  addSpace();

  addSectionTitle('2. DANE RACHUNKU BANKOWEGO');

  addField(
    'Wlasciciel rachunku',
    data.accountHolder || fullName
  );

  addField(
    'Nazwa banku',
    data.bankName
  );

  addField(
    'Numer rachunku / IBAN',
    formatAccountNumber(data.iban)
  );

  addSpace();

  addSectionTitle('3. DYSPOZYCJA PRACOWNIKA');

  addParagraph(
    'Wyrazam zgode na przekazywanie przez We Go Job Sp. z o.o. mojego wynagrodzenia z tytulu wskazanej umowy przelewem na podany przeze mnie rachunek bankowy.'
  );

  addParagraph(
    'Oswiadczam, ze podane dane oraz numer rachunku bankowego sa prawidlowe. Zobowiazuje sie niezwlocznie poinformowac pracodawce lub zleceniodawce o kazdej zmianie numeru rachunku bankowego.'
  );

  addField(
    'Miejscowosc',
    data.city
  );

  addField(
    'Data',
    data.date
  );

  addSpace();

  addSectionTitle('4. PODPIS PRACOWNIKA');

  addSignature(signature);

  return finish();
}