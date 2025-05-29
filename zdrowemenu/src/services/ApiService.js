const API_BASE = 'http://localhost:8000';

// Funkcja pomocnicza do wykonywania zapytań z autoryzacją
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd ${response.status}`);
  }
  
  return response.json();
};

// Serwis API
const ApiService = {
  // Autoryzacja
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Nieprawidłowy email lub hasło');
    }
    
    return response.json();
  },
  
  register: async (userData) => {
    return fetchWithAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  getCurrentUser: async () => {
    return fetchWithAuth('/api/auth/me');
  },
  
  // Diety
  getDiets: async () => {
    return fetch(`${API_BASE}/api/diety`).then(res => res.json());
  },
  
  getDiet: async (dietId) => {
    return fetch(`${API_BASE}/api/diety/${dietId}`).then(res => res.json());
  },
  
  // Jadłospisy
  getMenu: async (date) => {
    return fetchWithAuth(`/api/jadlospis/${date}`);
  },
  
  getWeeklyMenu: async (startDate) => {
    return fetchWithAuth(`/api/jadlospis/tydzien/${startDate}`);
  },
  
  // Produkty
  searchProducts: async (query, page = 1, pageSize = 10) => {
    return fetchWithAuth(`/api/produkty/szukaj?zapytanie=${encodeURIComponent(query)}&strona=${page}&na_strone=${pageSize}`);
  },
  
  getProduct: async (barcode) => {
    return fetchWithAuth(`/api/produkty/${barcode}`);
  },
  
  // Kompatybilność
  checkMenuCompatibility: async (userId, date) => {
    return fetchWithAuth(`/api/uzytkownik/${userId}/sprawdz-kompatybilnosc/${date}`);
  },
  
  checkProductCompatibility: async (productId, userId) => {
    return fetchWithAuth(`/api/produkt/${productId}/sprawdz-kompatybilnosc/${userId}`);
  },

  updateUserProfile: async (userData) => {
  return fetchWithAuth('/api/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

};

export default ApiService;
