from fastapi import FastAPI, HTTPException, Query, Depends, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import requests
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import auth
from auth import UzytkownikIn, UzytkownikOut, UzytkownikAuth, Token

# Ładowanie zmiennych środowiskowych
load_dotenv()

app = FastAPI(
    title="ZdroweMenu API",
    description="API dla dietetycznego doradcy sanatoryjnego"
)

# Konfiguracja CORS dla aplikacji React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # W produkcji zmienić na konkretny origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bazowy URL API Open Food Facts
OPENFOODFACTS_API_URL = "https://world.openfoodfacts.org/api/v0"

# Przykładowe dane diet
DIETY = [
    {"id": 1, "nazwa": "Standardowa", "opis": "Regularna, zbilansowana dieta"},
    {"id": 2, "nazwa": "Niskowęglowodanowa", "opis": "Dieta z ograniczoną ilością węglowodanów", 
     "zabronione_produkty": ["makaron", "chleb", "cukier"]},
    {"id": 3, "nazwa": "Cukrzycowa", "opis": "Dieta dla osób z cukrzycą", 
     "zabronione_produkty": ["cukier", "miód", "słodycze"]},
    {"id": 4, "nazwa": "Bezglutenowa", "opis": "Dieta bez glutenu", 
     "zabronione_produkty": ["pszenica", "jęczmień", "żyto"]},
]

# Przykładowe jadłospisy (w rzeczywistej aplikacji byłyby w bazie danych)
JADLOSPISY = {
    "2023-11-01": {
        "sniadanie": {
            "id": 1,
            "nazwa": "Śniadanie",
            "posilki": [
                {"produkt_id": "3017620422003", "nazwa": "Nutella", "ilosc": 30, "jednostka": "g", "kalorie": 159},
                {"produkt_id": "3175680011480", "nazwa": "Chleb pełnoziarnisty", "ilosc": 60, "jednostka": "g", "kalorie": 150},
                {"produkt_id": "8000500037560", "nazwa": "Sok pomarańczowy", "ilosc": 200, "jednostka": "ml", "kalorie": 90}
            ]
        },
        "obiad": {
            "id": 2,
            "nazwa": "Obiad",
            "posilki": [
                {"produkt_id": "3242272620196", "nazwa": "Zupa pomidorowa", "ilosc": 300, "jednostka": "ml", "kalorie": 75},
                {"produkt_id": "3700478501487", "nazwa": "Pierś z kurczaka", "ilosc": 150, "jednostka": "g", "kalorie": 165},
                {"produkt_id": "3560070472888", "nazwa": "Ryż", "ilosc": 100, "jednostka": "g", "kalorie": 130},
                {"produkt_id": "3760201130469", "nazwa": "Mieszanka warzyw", "ilosc": 150, "jednostka": "g", "kalorie": 75}
            ]
        },
        "kolacja": {
            "id": 3,
            "nazwa": "Kolacja",
            "posilki": [
                {"produkt_id": "3222472795506", "nazwa": "Zupa jarzynowa", "ilosc": 250, "jednostka": "ml", "kalorie": 60},
                {"produkt_id": "3564700011683", "nazwa": "Filet rybny", "ilosc": 120, "jednostka": "g", "kalorie": 120},
                {"produkt_id": "3276550192206", "nazwa": "Ziemniaki gotowane", "ilosc": 120, "jednostka": "g", "kalorie": 90},
                {"produkt_id": "3276550464723", "nazwa": "Sałatka zielona", "ilosc": 100, "jednostka": "g", "kalorie": 15}
            ]
        },
        "przekaski": [
            {
                "id": 4,
                "nazwa": "Przekąska popołudniowa",
                "posilki": [
                    {"produkt_id": "3033490004743", "nazwa": "Jogurt", "ilosc": 125, "jednostka": "g", "kalorie": 88},
                    {"produkt_id": "3560070985432", "nazwa": "Jabłko", "ilosc": 150, "jednostka": "g", "kalorie": 75}
                ]
            }
        ]
    }
}

# Przykładowy użytkownik (w rzeczywistej aplikacji byłby w bazie danych)
UZYTKOWNICY = {
    1: {
        "id": 1,
        "imie": "Jan Kowalski",
        "alergie": ["gluten", "laktoza"],
        "dieta_id": 4,  # Dieta bezglutenowa
        "cel_kalorii": 2000
    }
}

@app.get("/")
def odczytaj_glowna():
    """Endpoint główny API"""
    return {"wiadomosc": "Witaj w API ZdroweMenu - Dietetyczny doradca sanatoryjny"}

@app.get("/api/produkty/szukaj")
async def szukaj_produkty(
    zapytanie: str = Query(..., min_length=2, description="Fraza do wyszukania"),
    strona: int = Query(1, ge=1, description="Numer strony wyników"),
    na_strone: int = Query(10, ge=1, le=50, description="Liczba wyników na stronę")
):
    """
    Wyszukiwanie produktów spożywczych w bazie Open Food Facts.
    """
    try:
        response = requests.get(
            f"{OPENFOODFACTS_API_URL}/search",
            params={
                "search_terms": zapytanie,
                "page": strona,
                "page_size": na_strone,
                "json": True
            }
        )
        response.raise_for_status()
        dane = response.json()
        
        wyniki = []
        for produkt in dane.get("products", []):
            wartosci_odzywcze = produkt.get("nutriments", {})
            
            element = {
                "id": produkt.get("code", ""),
                "nazwa": produkt.get("product_name", "Nieznany"),
                "marka": produkt.get("brands"),
                "wartosci_odzywcze": {
                    "kalorie": wartosci_odzywcze.get("energy-kcal_100g"),
                    "bialko": wartosci_odzywcze.get("proteins_100g"),
                    "weglowodany": wartosci_odzywcze.get("carbohydrates_100g"),
                    "tluszcze": wartosci_odzywcze.get("fat_100g"),
                    "blonnik": wartosci_odzywcze.get("fiber_100g"),
                    "sol": wartosci_odzywcze.get("salt_100g")
                },
                "alergeny": produkt.get("allergens", ""),
                "skladniki": produkt.get("ingredients_text"),
                "url_obrazka": produkt.get("image_url")
            }
            wyniki.append(element)
        
        return {
            "strona": strona,
            "na_strone": na_strone,
            "całkowita_liczba": dane.get("count", 0),
            "produkty": wyniki
        }
        
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Błąd komunikacji z API Open Food Facts: {str(e)}")

@app.get("/api/produkty/{kod_kreskowy}")
async def odczytaj_produkt(kod_kreskowy: str):
    """
    Pobierz szczegółowe informacje o produkcie na podstawie kodu kreskowego.
    """
    try:
        response = requests.get(f"{OPENFOODFACTS_API_URL}/product/{kod_kreskowy}.json")
        response.raise_for_status()
        dane = response.json()
        
        if dane.get("status") != 1:
            raise HTTPException(status_code=404, detail="Produkt nie został znaleziony")
        
        produkt = dane.get("product", {})
        wartosci_odzywcze = produkt.get("nutriments", {})
        
        return {
            "id": kod_kreskowy,
            "nazwa": produkt.get("product_name", "Nieznany"),
            "marka": produkt.get("brands"),
            "wartosci_odzywcze": {
                "kalorie": wartosci_odzywcze.get("energy-kcal_100g"),
                "bialko": wartosci_odzywcze.get("proteins_100g"),
                "weglowodany": wartosci_odzywcze.get("carbohydrates_100g"),
                "tluszcze": wartosci_odzywcze.get("fat_100g"),
                "blonnik": wartosci_odzywcze.get("fiber_100g"),
                "sol": wartosci_odzywcze.get("salt_100g")
            },
            "alergeny": produkt.get("allergens", ""),
            "skladniki": produkt.get("ingredients_text"),
            "url_obrazka": produkt.get("image_url")
        }
        
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Błąd komunikacji z API Open Food Facts: {str(e)}")

@app.get("/api/diety")
async def odczytaj_diety():
    """Pobierz listę dostępnych diet."""
    return DIETY

@app.get("/api/diety/{dieta_id}")
async def odczytaj_diete(dieta_id: int):
    """Pobierz szczegółowe informacje o diecie na podstawie ID."""
    for dieta in DIETY:
        if dieta["id"] == dieta_id:
            return dieta
    raise HTTPException(status_code=404, detail="Dieta nie została znaleziona")

@app.get("/api/jadlospis/{data}")
async def odczytaj_jadlospis(data: str):
    """
    Pobierz jadłospis na konkretny dzień.
    Format daty: YYYY-MM-DD
    """
    if data in JADLOSPISY:
        jadlospis = JADLOSPISY[data]
        
        # Obliczanie całkowitej liczby kalorii
        suma_kalorii = 0
        for posilek_typ, posilek in jadlospis.items():
            if posilek_typ != "przekaski":
                for element in posilek["posilki"]:
                    suma_kalorii += element.get("kalorie", 0) or 0
            else:
                for przekaska in posilek:
                    for element in przekaska["posilki"]:
                        suma_kalorii += element.get("kalorie", 0) or 0
        
        return {
            "data": data,
            "jadlospis": jadlospis,
            "suma_kalorii": suma_kalorii
        }
        
    raise HTTPException(status_code=404, detail=f"Nie znaleziono jadłospisu na dzień {data}")

@app.get("/api/jadlospis/tydzien/{data_poczatkowa}")
async def odczytaj_jadlospis_tygodniowy(data_poczatkowa: str):
    """
    Pobierz jadłospisy na tydzień, zaczynając od podanej daty.
    Format daty: YYYY-MM-DD
    """
    try:
        data_start = datetime.strptime(data_poczatkowa, "%Y-%m-%d")
        jadlospisy_tygodniowe = []
        
        for i in range(7):
            data_biezaca = data_start + timedelta(days=i)
            data_str = data_biezaca.strftime("%Y-%m-%d")
            
            if data_str in JADLOSPISY:
                jadlospis = JADLOSPISY[data_str]
                
                # Obliczanie całkowitej liczby kalorii
                suma_kalorii = 0
                for posilek_typ, posilek in jadlospis.items():
                    if posilek_typ != "przekaski":
                        for element in posilek["posilki"]:
                            suma_kalorii += element.get("kalorie", 0) or 0
                    else:
                        for przekaska in posilek:
                            for element in przekaska["posilki"]:
                                suma_kalorii += element.get("kalorie", 0) or 0
                
                jadlospisy_tygodniowe.append({
                    "data": data_str,
                    "jadlospis": jadlospis,
                    "suma_kalorii": suma_kalorii
                })
            else:
                jadlospisy_tygodniowe.append({
                    "data": data_str,
                    "jadlospis": None,
                    "suma_kalorii": 0
                })
        
        return jadlospisy_tygodniowe
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Nieprawidłowy format daty. Użyj formatu YYYY-MM-DD")

@app.get("/api/uzytkownik/{uzytkownik_id}")
async def odczytaj_uzytkownika(
    uzytkownik_id: int,
    current_user: UzytkownikAuth = Depends(auth.get_current_active_user)
):
    """Pobierz informacje o użytkowniku."""
    # Sprawdź czy użytkownik jest administratorem lub prosi o swoje dane
    is_own_data = False
    for email, user_data in auth.USERS_DB.items():
        if email == current_user.email and user_data["id"] == uzytkownik_id:
            is_own_data = True
            break
    
    if not current_user.is_admin and not is_own_data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Brak uprawnień do dostępu do danych tego użytkownika"
        )
    
    # Znajdź użytkownika po ID
    for email, user_data in auth.USERS_DB.items():
        if user_data["id"] == uzytkownik_id:
            return {
                "id": user_data["id"],
                "email": user_data["email"],
                "imie": user_data["imie"],
                "nazwisko": user_data["nazwisko"],
                "alergie": user_data["alergie"],
                "dieta_id": user_data["dieta_id"],
                "cel_kalorii": user_data["cel_kalorii"]
            }
    
    raise HTTPException(status_code=404, detail="Użytkownik nie został znaleziony")

@app.get("/api/uzytkownik/{uzytkownik_id}/sprawdz-kompatybilnosc/{data}")
async def sprawdz_kompatybilnosc_jadlospisu(
    uzytkownik_id: int, 
    data: str,
    current_user: UzytkownikAuth = Depends(auth.get_current_active_user)
):
    """
    Sprawdź, czy jadłospis na dany dzień jest kompatybilny z dietą i alergiami użytkownika.
    """
    # Sprawdzenie, czy użytkownik ma uprawnienia
    is_own_data = False
    for email, user_data in auth.USERS_DB.items():
        if email == current_user.email and user_data["id"] == uzytkownik_id:
            is_own_data = True
            break
    
    if not current_user.is_admin and not is_own_data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Brak uprawnień do dostępu do danych tego użytkownika"
        )
    
    # Pobranie danych użytkownika
    uzytkownik = None
    for email, user_data in auth.USERS_DB.items():
        if user_data["id"] == uzytkownik_id:
            uzytkownik = user_data
            break
    
    if not uzytkownik:
        raise HTTPException(status_code=404, detail="Użytkownik nie został znaleziony")
    
    # Sprawdzenie, czy jadłospis istnieje
    if data not in JADLOSPISY:
        raise HTTPException(status_code=404, detail=f"Nie znaleziono jadłospisu na dzień {data}")
    
    jadlospis = JADLOSPISY[data]
    
    # Znajdź dietę użytkownika
    dieta = None
    for d in DIETY:
        if d["id"] == uzytkownik["dieta_id"]:
            dieta = d
            break
    
    if not dieta:
        raise HTTPException(status_code=404, detail="Dieta użytkownika nie została znaleziona")
    
    # Inicjalizacja wyników
    problemy_alergenow = {}
    problemy_diety = {}
    suma_kalorii = 0
    
    # Funkcja pomocnicza do sprawdzania pozycji jadłospisu
    async def sprawdz_element(element):
        nonlocal suma_kalorii
        suma_kalorii += element.get("kalorie", 0) or 0
        
        try:
            # Pobierz informacje o produkcie z API
            response = requests.get(f"{OPENFOODFACTS_API_URL}/product/{element['produkt_id']}.json")
            if response.status_code == 200:
                dane = response.json()
                if dane.get("status") == 1:
                    produkt = dane.get("product", {})
                    
                    # Sprawdź alergeny
                    alergeny = produkt.get("allergens", "").lower()
                    for alergia in uzytkownik["alergie"]:
                        if alergia.lower() in alergeny:
                            return {
                                "nazwa": element["nazwa"],
                                "problem": f"Zawiera alergen: {alergia}",
                                "typ": "alergen"
                            }
                    
                    # Sprawdź zgodność z dietą
                    if "zabronione_produkty" in dieta and produkt.get("ingredients_text"):
                        skladniki = produkt.get("ingredients_text", "").lower()
                        for produkt_zabroniony in dieta["zabronione_produkty"]:
                            if produkt_zabroniony.lower() in skladniki:
                                return {
                                    "nazwa": element["nazwa"],
                                    "problem": f"Zawiera zabroniony składnik: {produkt_zabroniony}",
                                    "typ": "dieta"
                                }
        except:
            # W przypadku błędu, zakładamy, że produkt może być problematyczny
            pass
        
        return None
    
    # Sprawdź każdy posiłek
    for posilek_typ, posilek in jadlospis.items():
        if posilek_typ != "przekaski":
            problemy_posilku_alergeny = []
            problemy_posilku_dieta = []
            
            for element in posilek["posilki"]:
                problem = await sprawdz_element(element)
                if problem:
                    if problem["typ"] == "alergen":
                        problemy_posilku_alergeny.append(f"{problem['nazwa']} ({problem['problem']})")
                    elif problem["typ"] == "dieta":
                        problemy_posilku_dieta.append(f"{problem['nazwa']} ({problem['problem']})")
            
            if problemy_posilku_alergeny:
                problemy_alergenow[posilek["nazwa"]] = problemy_posilku_alergeny
                
            if problemy_posilku_dieta:
                problemy_diety[posilek["nazwa"]] = problemy_posilku_dieta
        else:
            for przekaska in posilek:
                problemy_przekaski_alergeny = []
                problemy_przekaski_dieta = []
                
                for element in przekaska["posilki"]:
                    problem = await sprawdz_element(element)
                    if problem:
                        if problem["typ"] == "alergen":
                            problemy_przekaski_alergeny.append(f"{problem['nazwa']} ({problem['problem']})")
                        elif problem["typ"] == "dieta":
                            problemy_przekaski_dieta.append(f"{problem['nazwa']} ({problem['problem']})")
                
                if problemy_przekaski_alergeny:
                    problemy_alergenow[przekaska["nazwa"]] = problemy_przekaski_alergeny
                    
                if problemy_przekaski_dieta:
                    problemy_diety[przekaska["nazwa"]] = problemy_przekaski_dieta
    
    # Sprawdź cel kalorii
    problemy_kalorii = []
    if uzytkownik["cel_kalorii"]:
        roznica = abs(suma_kalorii - uzytkownik["cel_kalorii"])
        if roznica > uzytkownik["cel_kalorii"] * 0.1:  # Jeśli więcej niż 10% odchylenia
            if suma_kalorii > uzytkownik["cel_kalorii"]:
                problemy_kalorii.append(f"Całkowita liczba kalorii ({suma_kalorii}) przekracza Twój cel ({uzytkownik['cel_kalorii']})")
            else:
                problemy_kalorii.append(f"Całkowita liczba kalorii ({suma_kalorii}) jest poniżej Twojego celu ({uzytkownik['cel_kalorii']})")
    
    return {
        "data": data,
        "uzytkownik_id": uzytkownik_id,
        "dieta": dieta["nazwa"],
        "problemy_alergenow": problemy_alergenow,
        "problemy_diety": problemy_diety,
        "problemy_kalorii": problemy_kalorii,
        "jest_kompatybilny": len(problemy_alergenow) == 0 and len(problemy_diety) == 0,
        "suma_kalorii": suma_kalorii
    }

@app.get("/api/produkt/{produkt_id}/sprawdz-kompatybilnosc/{uzytkownik_id}")
async def sprawdz_kompatybilnosc_produktu(
    produkt_id: str, 
    uzytkownik_id: int,
    current_user: UzytkownikAuth = Depends(auth.get_current_active_user)
):
    """
    Sprawdź, czy produkt jest kompatybilny z dietą i alergiami użytkownika.
    """
    # Sprawdzenie, czy użytkownik ma uprawnienia
    is_own_data = False
    for email, user_data in auth.USERS_DB.items():
        if email == current_user.email and user_data["id"] == uzytkownik_id:
            is_own_data = True
            break
    
    if not current_user.is_admin and not is_own_data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Brak uprawnień do dostępu do danych tego użytkownika"
        )
    
    # Pobranie danych użytkownika
    uzytkownik = None
    for email, user_data in auth.USERS_DB.items():
        if user_data["id"] == uzytkownik_id:
            uzytkownik = user_data
            break
    
    if not uzytkownik:
        raise HTTPException(status_code=404, detail="Użytkownik nie został znaleziony")
    
    # Znajdź dietę użytkownika
    dieta = None
    for d in DIETY:
        if d["id"] == uzytkownik["dieta_id"]:
            dieta = d
            break
    
    if not dieta:
        raise HTTPException(status_code=404, detail="Dieta użytkownika nie została znaleziona")
    
    try:
        # Pobierz informacje o produkcie z API
        response = requests.get(f"{OPENFOODFACTS_API_URL}/product/{produkt_id}.json")
        response.raise_for_status()
        dane = response.json()
        
        if dane.get("status") != 1:
            raise HTTPException(status_code=404, detail="Produkt nie został znaleziony")
        
        produkt = dane.get("product", {})
        
        # Inicjalizacja wyników
        problemy_alergenow = []
        problemy_diety = []
        
        # Sprawdź alergeny
        alergeny = produkt.get("allergens", "").lower()
        for alergia in uzytkownik["alergie"]:
            if alergia.lower() in alergeny:
                problemy_alergenow.append(f"Zawiera alergen: {alergia}")
        
        # Sprawdź zgodność z dietą
        if "zabronione_produkty" in dieta and produkt.get("ingredients_text"):
            skladniki = produkt.get("ingredients_text", "").lower()
            for produkt_zabroniony in dieta["zabronione_produkty"]:
                if produkt_zabroniony.lower() in skladniki:
                    problemy_diety.append(f"Zawiera zabroniony składnik: {produkt_zabroniony}")
        
        return {
            "produkt_id": produkt_id,
            "nazwa_produktu": produkt.get("product_name", "Nieznany"),
            "uzytkownik_id": uzytkownik_id,
            "dieta": dieta["nazwa"],
            "problemy_alergenow": problemy_alergenow,
            "problemy_diety": problemy_diety,
            "jest_kompatybilny": len(problemy_alergenow) == 0 and len(problemy_diety) == 0
        }
        
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Błąd komunikacji z API Open Food Facts: {str(e)}")

# Endpointy związane z autoryzacją
@app.post("/api/auth/register", response_model=UzytkownikOut)
async def zarejestruj_uzytkownika(user: UzytkownikIn):
    """
    Rejestracja nowego użytkownika.
    """
    db_user = auth.register_user(user)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Użytkownik z takim adresem email już istnieje"
        )
    return db_user

@app.post("/api/auth/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Logowanie użytkownika i wydanie tokenu JWT.
    """
    user = auth.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowy email lub hasło",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Znajdź ID użytkownika
    user_id = None
    for email, user_data in auth.USERS_DB.items():
        if email == user.email:
            user_id = user_data["id"]
            break
    
    return {"access_token": access_token, "token_type": "bearer", "user_id": user_id}

@app.get("/api/auth/me", response_model=UzytkownikOut)
async def read_users_me(current_user: UzytkownikAuth = Depends(auth.get_current_active_user)):
    """
    Pobierz informacje o zalogowanym użytkowniku.
    """
    # Znajdź ID użytkownika
    user_id = None
    for email, user_data in auth.USERS_DB.items():
        if email == current_user.email:
            user_id = user_data["id"]
            break
    
    return {
        "id": user_id,
        "email": current_user.email,
        "imie": current_user.imie,
        "nazwisko": current_user.nazwisko,
        "alergie": current_user.alergie,
        "dieta_id": current_user.dieta_id,
        "cel_kalorii": current_user.cel_kalorii
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 