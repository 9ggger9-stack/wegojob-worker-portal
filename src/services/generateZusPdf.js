import { createPdfBuilder } from './pdfBuilder.js';

const yes = (value) =>
  String(value || '').trim().toLowerCase() === 'tak';

const safe = (value, fallback = '-') => {
  const result = String(value ?? '').trim();
  return result || fallback;
};

export async function generateZusPdf(
  employee = {},
  data = {},
  signature = ''
) {
  const builder = createPdfBuilder({
    title: 'OSWIADCZENIE ZLECENIOBIORCY DO CELOW ZUS',
    footerTitle: 'Oswiadczenie do celow ZUS',
  });

  const {
    addSectionTitle,
    addField,
    addParagraph,
    addCheckboxRow,
    addSignature,
    addSpace,
    ensureSpace,
    finish,
  } = builder;

  const fullName =
    data.fullName ||
    employee.fullName ||
    `${employee.firstName || ''} ${employee.surname || ''}`.trim();

  addSectionTitle('OSWIADCZENIE ZLECENIOBIORCY DO CELOW ZUS');
  addParagraph(
    'Dokument sluzy do ustalenia prawidlowego zakresu ubezpieczen spolecznych i zdrowotnych.',
    { fontSize: 8.5, lineHeight: 3.9, marginBottom: 1 }
  );

  addSpace(1.5);
  addSectionTitle('1. DANE ZLECENIOBIORCY');
  addField('Imie i nazwisko', safe(fullName));
  addField('PESEL', safe(data.pesel || employee.pesel));
  addField('Adres zamieszkania', safe(data.address));
  addField('Miejscowosc', safe(data.city));
  addField('Rodzaj umowy', safe(data.contract, 'Umowa zlecenia'));

  addSpace(1.5);
  addSectionTitle('2. DANE PLATNIKA SKLADEK');
  addField('Nazwa platnika', safe(data.payer, 'We Go Job Sp. z o.o.'));
  addField('Adres platnika', safe(data.payerAddress));

  addSpace(1.5);
  addSectionTitle('3. INNE ZATRUDNIENIE');
  addCheckboxRow(
    'Czy wykonujesz prace na podstawie innej umowy?',
    yes(data.otherEmployment)
  );

  if (yes(data.otherEmployment)) {
    addField(
      'Nazwa pracodawcy lub zleceniodawcy',
      safe(data.otherEmployer)
    );
  }

  addCheckboxRow(
    'Czy podstawa skladek z innego zatrudnienia wynosi co najmniej minimalne wynagrodzenie?',
    yes(data.otherSalaryMinimum)
  );

  addSpace(1.5);
  addSectionTitle('4. DZIALALNOSC GOSPODARCZA');
  addCheckboxRow(
    'Czy prowadzisz dzialalnosc gospodarcza?',
    yes(data.business)
  );

  if (yes(data.business)) {
    addField(
      'Informacja o podstawie skladek',
      safe(data.businessBasis)
    );
  }

  addSpace(1.5);
  addSectionTitle('5. INNE TYTULY DO UBEZPIECZEN');
  addCheckboxRow(
    'Czy posiadasz inny tytul do ubezpieczen spolecznych?',
    yes(data.otherInsurance)
  );

  if (yes(data.otherInsurance)) {
    addField(
      'Szczegoly innego tytulu',
      safe(data.otherInsuranceDetails)
    );
  }

  addCheckboxRow(
    'Czy masz ustalone prawo do emerytury lub renty?',
    yes(data.pension)
  );

  if (yes(data.pension)) {
    addField(
      'Rodzaj i szczegoly swiadczenia',
      safe(data.pensionDetails)
    );
  }

  addCheckboxRow(
    'Czy jestes zarejestrowany/a jako osoba bezrobotna?',
    yes(data.unemployed)
  );

  addSpace(1.5);
  addSectionTitle('6. STATUS UCZNIA LUB STUDENTA');
  addCheckboxRow(
    'Czy posiadasz status ucznia, studenta lub sluchacza?',
    yes(data.student)
  );

  if (yes(data.student)) {
    addField('Tryb nauki', safe(data.studyMode));
    addField('Nazwa szkoly lub uczelni', safe(data.school));
  }

  addSpace(1.5);
  addSectionTitle('7. DOBROWOLNE UBEZPIECZENIE CHOROBOWE');
  addCheckboxRow(
    'Czy wnioskujesz o objecie dobrowolnym ubezpieczeniem chorobowym?',
    yes(data.sicknessInsurance)
  );

  addSpace(1.5);

  /*
   * Rezerwujemy miejsce na oswiadczenie, date i podpis.
   * Jezeli brakuje miejsca, caly koncowy blok przechodzi razem
   * na kolejna strone zamiast tworzyc osobna trzecia strone.
   */
  ensureSpace(92);

  addSectionTitle('8. OSWIADCZENIE', {
    keepWithNext: 38,
  });

  addParagraph(
    'Oswiadczam, ze wszystkie podane przeze mnie informacje sa zgodne ze stanem faktycznym i kompletne.',
    { fontSize: 8.4, lineHeight: 4, marginBottom: 1.5 }
  );

  addParagraph(
    'Zobowiazuje sie niezwlocznie poinformowac platnika skladek o kazdej zmianie danych majacej wplyw na obowiazek ubezpieczen spolecznych lub zdrowotnych.',
    { fontSize: 8.4, lineHeight: 4, marginBottom: 1.5 }
  );

  addParagraph(
    'Przyjmuje do wiadomosci, ze podanie nieprawdziwych lub niepelnych informacji moze spowodowac koniecznosc dokonania korekt dokumentow ubezpieczeniowych i rozliczeniowych.',
    { fontSize: 8.4, lineHeight: 4, marginBottom: 2 }
  );

  addField('Miejscowosc', safe(data.city), {
    minHeight: 9,
  });

  addField('Data', safe(data.date), {
    minHeight: 9,
  });

  addSpace(2);
  addSectionTitle('9. PODPIS ZLECENIOBIORCY', {
    keepWithNext: 36,
  });

  addSignature(signature, {
    label: 'Podpis pracownika',
    width: 62,
    height: 20,
  });

  return finish();
}
