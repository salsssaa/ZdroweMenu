# ZdroweMenu - Backend API

Backend dla aplikacji mobilnej ZdroweMenu, wspomagającej pacjentów sanatoryjnych w przestrzeganiu zaleceń dietetycznych.

## Technologie

- Python 3.9+
- FastAPI
- Open Food Facts API
- JWT dla autoryzacji

## Instalacja

1. Zainstaluj wymagane zależności:
```bash
pip install -r requirements.txt
```

2. Uruchom serwer deweloperski:
```bash
uvicorn main:app --reload
```

Serwer będzie dostępny pod adresem: http://localhost:8000

## Dokumentacja API

Po uruchomieniu serwera, interaktywna dokumentacja API będzie dostępna pod:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Główne endpointy

### Autoryzacja
- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/token` - Logowanie i uzyskanie tokenu JWT
- `GET /api/auth/me` - Informacje o zalogowanym użytkowniku

### Produkty
- `GET /api/produkty/szukaj?zapytanie={fraza}` - Wyszukiwanie produktów spożywczych
- `GET /api/produkty/{kod_kreskowy}` - Informacje o produkcie na podstawie kodu kreskowego

### Diety
- `GET /api/diety` - Lista dostępnych diet
- `GET /api/diety/{dieta_id}` - Szczegóły diety

### Jadłospisy
- `GET /api/jadlospis/{data}` - Jadłospis na konkretny dzień (format daty: YYYY-MM-DD)
- `GET /api/jadlospis/tydzien/{data_poczatkowa}` - Jadłospisy na tydzień

### Użytkownicy i kompatybilność
- `GET /api/uzytkownik/{uzytkownik_id}` - Informacje o użytkowniku (wymaga autoryzacji)
- `GET /api/uzytkownik/{uzytkownik_id}/sprawdz-kompatybilnosc/{data}` - Sprawdzenie kompatybilności jadłospisu z dietą użytkownika
- `GET /api/produkt/{produkt_id}/sprawdz-kompatybilnosc/{uzytkownik_id}` - Sprawdzenie kompatybilności produktu z dietą użytkownika

## Uwagi do demo

- Dane są przechowywane w pamięci aplikacji (brak bazy danych)
- Demo zawiera przykładowe jadłospisy tylko na jeden dzień (2023-11-01)
- Dostępni użytkownicy:
  - Email: jan.kowalski@example.com, Hasło: haslo123
  - Email: anna.nowak@example.com, Hasło: haslo456
  - Email: admin@zdrowemenu.pl, Hasło: admin123 (administrator)
- Aplikacja używa rzeczywistego API Open Food Facts do pobierania informacji o produktach

## Autoryzacja

Backend wykorzystuje JWT (JSON Web Tokens) do autoryzacji użytkowników. Aby uzyskać dostęp do chronionych endpointów:

1. Zaloguj się przez endpoint `/api/auth/token` używając Twojego emaila i hasła
2. Otrzymasz token JWT, który należy dołączyć do kolejnych zapytań w nagłówku `Authorization: Bearer {token}`
3. Token jest ważny przez 24 godziny

Wszystkie endpointy związane z danymi użytkownika wymagają autoryzacji. Użytkownik może uzyskać dostęp tylko do swoich danych, chyba że jest administratorem. 