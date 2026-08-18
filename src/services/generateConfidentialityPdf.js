import { createPdfBuilder } from './pdfBuilder.js';

const safe = (value, fallback = '-') => {
  const result = String(value ?? '').trim();
  return result || fallback;
};

export async function generateConfidentialityPdf(
  employee = {},
  data = {},
  signature = ''
) {
  const builder = createPdfBuilder({
    title: 'OSWIADCZENIE O ZACHOWANIU POUFNOSCI',
    footerTitle: 'Oswiadczenie o zachowaniu poufnosci',
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

  const pesel = data.pesel || employee.pesel;

  addSectionTitle('OSWIADCZENIE O ZACHOWANIU POUFNOSCI');

  addParagraph(
    'Niniejsze oswiadczenie okresla zasady zachowania poufnosci informacji, z ktorymi pracownik zapoznaje sie w zwiazku z wykonywaniem pracy lub wspolpracy z We Go Job Sp. z o.o. oraz jej klientami.',
    {
      fontSize: 8.5,
      lineHeight: 3.9,
      marginBottom: 2,
    }
  );

  addSpace(1.5);

  addSectionTitle('1. DANE PRACOWNIKA');

  addField(
    'Imie i nazwisko',
    safe(fullName)
  );

  addField(
    'PESEL',
    safe(pesel)
  );

  addField(
    'Rodzaj umowy',
    safe(data.contract, 'Umowa zlecenia')
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

  addSectionTitle('2. PRZEDMIOT POUFNOSCI');

  addParagraph(
    'Pracownik zobowiazuje sie do zachowania w tajemnicy wszelkich informacji, danych i dokumentow, ktore uzyskal w zwiazku z wykonywaniem swoich obowiazkow lub wspolpraca z We Go Job Sp. z o.o., jej kontrahentami oraz klientami.'
  );

  addParagraph(
    'Za informacje poufne uwaza sie w szczegolnosci informacje dotyczace organizacji pracy, procesow operacyjnych, danych pracownikow i kandydatow, danych klientow i kontrahentow, wynagrodzen, dokumentow kadrowych, danych finansowych, informacji handlowych oraz innych informacji oznaczonych jako poufne lub takich, ktorych charakter wskazuje na koniecznosc ich ochrony.'
  );

  addSpace(1.5);

  addSectionTitle('3. OBOWIAZKI PRACOWNIKA');

  addParagraph(
    'Pracownik zobowiazuje sie w szczegolnosci do:'
  );

  addParagraph(
    '1) nieujawniania informacji poufnych osobom nieuprawnionym;'
  );

  addParagraph(
    '2) niewykorzystywania informacji poufnych do celow prywatnych lub innych celow niezwiązanych z wykonywana praca;'
  );

  addParagraph(
    '3) zabezpieczenia dokumentow, danych, loginow, hasel oraz innych informacji przed dostepem osob nieuprawnionych;'
  );

  addParagraph(
    '4) niekopiowania, niefotografowania ani nieprzekazywania dokumentow lub danych bez odpowiedniego upowaznienia;'
  );

  addParagraph(
    '5) nieudostepniania informacji poufnych za pomoca komunikatorow, poczty elektronicznej, mediow spolecznosciowych ani innych kanalow osobom nieuprawnionym.'
  );

  addSpace(1.5);
    addSectionTitle('4. OCHRONA DANYCH I INFORMACJI');

  addParagraph(
    'Pracownik zobowiazuje sie do przestrzegania zasad ochrony danych osobowych oraz do wykorzystywania danych osobowych wyłącznie w zakresie niezbednym do wykonywania powierzonych obowiazkow.'
  );

  addParagraph(
    'Pracownik nie moze przekazywac osobom trzecim danych osobowych ani informacji dotyczacych innych pracownikow, kandydatow, klientow lub kontrahentow, jezeli nie posiada odpowiedniego upowaznienia.'
  );

  addParagraph(
    'W przypadku utraty dokumentu, telefonu, komputera, dostepu do systemu lub innego nosnika zawierajacego informacje poufne pracownik zobowiazuje sie niezwlocznie poinformowac osobe odpowiedzialna za nadzor.'
  );

  addSpace(1.5);

  addSectionTitle('5. ZAKAZ UJAWNIANIA INFORMACJI');

  addParagraph(
    'Obowiazek zachowania poufnosci obejmuje informacje uzyskane w trakcie wykonywania pracy, niezaleznie od tego, czy zostaly przekazane w formie ustnej, pisemnej, elektronicznej, graficznej czy w jakiejkolwiek innej formie.'
  );

  addParagraph(
    'Pracownik zobowiazuje sie nie publikowac, nie przesylac, nie udostepniac ani nie rozpowszechniac informacji poufnych w internecie, mediach spolecznosciowych, komunikatorach lub innych publicznie dostepnych miejscach.'
  );

  addParagraph(
    'Obowiazek zachowania poufnosci dotyczy rowniez informacji, ktore pracownik poznal przypadkowo podczas wykonywania swoich obowiazkow.'
  );

  addSpace(1.5);

  addSectionTitle('6. ZWROT DOKUMENTOW I MATERIALOW');

  addParagraph(
    'Na zadanie We Go Job Sp. z o.o. lub po zakonczeniu wspolpracy pracownik zobowiazuje sie do niezwlocznego zwrotu wszystkich dokumentow, materialow, kluczy, kart dostepowych, identyfikatorow, nosnikow danych oraz innych przedmiotow zawierajacych informacje poufne.'
  );

  addParagraph(
    'Pracownik nie moze zachowywac kopii dokumentow ani danych nalezacych do We Go Job Sp. z o.o., jej klientow lub kontrahentow, chyba ze dalsze przechowywanie zostalo wyraznie dopuszczone przez osobe uprawniona.'
  );

  addSpace(1.5);

  addSectionTitle('7. ODPOWIEDZIALNOSC');

  addParagraph(
    'Pracownik przyjmuje do wiadomosci, ze naruszenie zasad poufnosci moze skutkowac odpowiedzialnoscia zgodnie z obowiazujacymi przepisami prawa oraz zasadami obowiazujacymi u pracodawcy lub zleceniodawcy.'
  );

  addParagraph(
    'Pracownik zobowiazuje sie niezwlocznie zglosic kazdy przypadek podejrzenia ujawnienia, utraty lub nieuprawnionego dostepu do informacji poufnych.'
  );

  addSpace(1.5);

  addSectionTitle('8. OSWIADCZENIE PRACOWNIKA');

  addParagraph(
    'Oswiadczam, ze zapoznalem/am sie z zasadami zachowania poufnosci oraz rozumiem obowiazki wynikajace z niniejszego oswiadczenia.'
  );

  addParagraph(
    'Zobowiazuje sie do przestrzegania zasad poufnosci podczas wykonywania pracy oraz po zakonczeniu wspolpracy, w zakresie wynikajacym z obowiazujacych przepisow i charakteru przekazanych informacji.'
  );

  addParagraph(
    'Potwierdzam, ze zostalem/am poinformowany/a o koniecznosci odpowiedniego zabezpieczenia informacji oraz dokumentow, do ktorych uzyskuje dostep w zwiazku z wykonywana praca.'
  );

  addSpace(2);

  /*
   * Rezerwujemy miejsce na koncowy blok:
   * miejscowosc, data i podpis.
   */
  ensureSpace(82);

  addSectionTitle('9. PODPIS PRACOWNIKA', {
    keepWithNext: 36,
  });

  addField(
    'Miejscowosc',
    safe(data.city),
    {
      minHeight: 9,
    }
  );

  addField(
    'Data',
    safe(data.date),
    {
      minHeight: 9,
    }
  );

  addSpace(2);

  addSignature(signature, {
    label: 'Podpis pracownika',
    width: 62,
    height: 20,
  });
    return finish();
}