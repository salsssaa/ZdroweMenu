from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# Klasy dla modeli danych
class UzytkownikAuth(BaseModel):
    email: str
    hashed_password: str
    imie: str
    nazwisko: Optional[str] = None
    is_active: bool = True
    is_admin: bool = False
    alergie: list = []
    dieta_id: Optional[int] = None
    cel_kalorii: Optional[int] = None

class UzytkownikIn(BaseModel):
    email: str
    password: str
    imie: str
    nazwisko: Optional[str] = None
    alergie: list = []
    dieta_id: Optional[int] = None
    cel_kalorii: Optional[int] = None

class UzytkownikOut(BaseModel):
    id: int
    email: str
    imie: str
    nazwisko: Optional[str] = None
    alergie: list = []
    dieta_id: Optional[int] = None
    cel_kalorii: Optional[int] = None

class TokenData(BaseModel):
    email: Optional[str] = None
    exp: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

# Konfiguracja bezpieczeństwa
SECRET_KEY = "TAJNY_KLUCZ_JWT_ZDROWE_MENU_NALEZY_ZMIENIC_W_PRODUKCJI"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 godziny

# Narzędzia do obsługi haseł i tokenów
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# Przykładowa baza danych użytkowników (w prawdziwej aplikacji byłaby to baza danych)
USERS_DB = {
    "jan.kowalski@example.com": {
        "id": 1,
        "email": "jan.kowalski@example.com",
        "hashed_password": pwd_context.hash("haslo123"),
        "imie": "Jan",
        "nazwisko": "Kowalski",
        "is_active": True,
        "is_admin": False,
        "alergie": ["gluten", "laktoza"],
        "dieta_id": 4,  # Dieta bezglutenowa
        "cel_kalorii": 2000
    },
    "anna.nowak@example.com": {
        "id": 2,
        "email": "anna.nowak@example.com",
        "hashed_password": pwd_context.hash("haslo456"),
        "imie": "Anna",
        "nazwisko": "Nowak",
        "is_active": True,
        "is_admin": False,
        "alergie": ["orzechy"],
        "dieta_id": 2,  # Dieta niskowęglowodanowa
        "cel_kalorii": 1800
    },
    "admin@zdrowemenu.pl": {
        "id": 3,
        "email": "admin@zdrowemenu.pl",
        "hashed_password": pwd_context.hash("admin123"),
        "imie": "Admin",
        "nazwisko": "Systemu",
        "is_active": True,
        "is_admin": True,
        "alergie": [],
        "dieta_id": 1,  # Dieta standardowa
        "cel_kalorii": 2200
    }
}

# Funkcje pomocnicze
def verify_password(plain_password, hashed_password):
    """Weryfikacja hasła."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Generowanie haszu hasła."""
    return pwd_context.hash(password)

def get_user(email: str):
    """Pobieranie użytkownika z bazy danych."""
    if email in USERS_DB:
        user_dict = USERS_DB[email]
        return UzytkownikAuth(**user_dict)
    return None

def authenticate_user(email: str, password: str):
    """Uwierzytelnianie użytkownika."""
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Tworzenie tokena JWT."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Pobranie bieżącego użytkownika na podstawie tokena JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Nieprawidłowe dane uwierzytelniające",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, exp=payload.get("exp"))
    except JWTError:
        raise credentials_exception
    user = get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: UzytkownikAuth = Depends(get_current_user)):
    """Sprawdzenie czy użytkownik jest aktywny."""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Nieaktywny użytkownik")
    return current_user

def get_user_by_id(user_id: int):
    """Pobieranie użytkownika po ID."""
    for email, user_data in USERS_DB.items():
        if user_data["id"] == user_id:
            return UzytkownikAuth(**user_data)
    return None

def register_user(user: UzytkownikIn) -> UzytkownikOut:
    """Rejestracja nowego użytkownika."""
    if user.email in USERS_DB:
        return None
    
    # Wygeneruj nowe ID użytkownika
    new_id = max([u["id"] for u in USERS_DB.values()]) + 1
    
    # Stwórz nowego użytkownika
    hashed_password = get_password_hash(user.password)
    
    user_dict = {
        "id": new_id,
        "email": user.email,
        "hashed_password": hashed_password,
        "imie": user.imie,
        "nazwisko": user.nazwisko,
        "is_active": True,
        "is_admin": False,
        "alergie": user.alergie,
        "dieta_id": user.dieta_id,
        "cel_kalorii": user.cel_kalorii
    }
    
    # Dodaj do "bazy danych"
    USERS_DB[user.email] = user_dict
    
    # Zwróć dane użytkownika bez hasła
    return UzytkownikOut(
        id=new_id,
        email=user.email,
        imie=user.imie,
        nazwisko=user.nazwisko,
        alergie=user.alergie,
        dieta_id=user.dieta_id,
        cel_kalorii=user.cel_kalorii
    ) 