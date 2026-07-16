# WeGoJob Worker Portal — kompletna wersja mobilna

Zmiany:
- usunięto moduły Transport i Zakwaterowanie,
- dodano wszystkie przekazane dokumenty: kwestionariusz + RODO, konto bankowe, ZUS + wniosek podatkowy, poufność, PPK i checklistę,
- poprawiono podpis na Androidzie i iPhonie (Pointer Events + Touch fallback),
- dodano przycisk „Wstecz” na każdej podstronie,
- zachowano odzież i wniosek urlopowy.

Publikacja: podmień pliki w lokalnym repozytorium, Commit to main, Push origin. Netlify zaktualizuje stronę automatycznie.

## Integracja Make + Google Sheets
Portal wysyła każdy podpisany dokument do webhooka Make jako JSON.

Najważniejsze pola webhooka:
- `submittedAt`
- `documentType`
- `employee.fullName`
- `employee.pesel`
- `employee.passportNumber`
- `employee.phone`
- `employee.email`
- `employee.project`
- `employee.bankAccount`
- `status`
- `data`
- `signature`

W Make po odebraniu pierwszego testu dodaj Google Sheets → Add a Row i przypisz pola do kolumn.


## Wersja v3 — zdjęcia dokumentów
Dodano przesyłanie z telefonu:
- paszportu,
- karty pobytu lub dowodu osobistego,
- dokumentu PESEL,
- decyzji / innego dokumentu legalizacyjnego.

Zdjęcia są zmniejszane i kompresowane w przeglądarce, a następnie wysyłane do Make jako Base64.
