# WeGoJob Worker Portal — React v1

## Co zawiera
- nowoczesny portal pracownika jako jeden web-app,
- moduł odzieży z podpisem palcem i tekstem zgody,
- urlop,
- transport,
- zakwaterowanie,
- kontakt z koordynatorem,
- obsługę tokenu w adresie: `?token=ABC123`,
- przygotowaną warstwę API do późniejszego połączenia z Make / Google Sheets.

## Publikacja w Netlify
1. Rozpakuj ZIP.
2. W Netlify wybierz `Add new site` → `Deploy manually` lub połącz repozytorium.
3. Najpewniejsza metoda: wrzuć projekt do GitHub i połącz GitHub z Netlify.
4. Netlify automatycznie wykona `npm run build` i opublikuje katalog `dist`.

## Lokalnie
```bash
npm install
npm run dev
```

## Następny etap
W `src/services/api.js` podłączymy webhook Make:
- pobranie danych pracownika po tokenie,
- zapis formularza,
- zapis podpisu,
- generowanie PDF i wysyłka do Google Drive.


## Wersja v2 - dokumenty zatrudnienia
Dodano:
- kwestionariusz osobowy z RODO,
- dyspozycję konta bankowego,
- oświadczenie do celów ZUS,
- oświadczenie o zachowaniu poufności,
- rezygnację z PPK,
- checklistę dokumentów pracownika.

Dane z kwestionariusza zapisują się lokalnie w przeglądarce i automatycznie uzupełniają kolejne formularze.
