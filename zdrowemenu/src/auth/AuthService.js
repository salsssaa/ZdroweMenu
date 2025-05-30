const API_BASE = 'http://localhost:8000';

export const loginUser = async (email, password) => {
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
  
  const data = await response.json();
  // Zapisz token w localStorage
  localStorage.setItem('authToken', data.access_token);
  localStorage.setItem('userId', data.user_id);
  
  return data;
};

export const registerUser = async (userData) => {

  const formattedData = {
    ...userData,
    dieta_id: userData.dieta_id ? parseInt(userData.dieta_id) : null,
    cel_kalorii: userData.cel_kalorii ? parseInt(userData.cel_kalorii) : null,
    alergie: userData.alergie ? userData.alergie.split(',').map(a => a.trim()) : []
  };


  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Błąd podczas rejestracji');
  }
  
  return response.json();
};


export const getCurrentUser = async () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // Jeśli token jest nieprawidłowy, usuń go z localStorage
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
      }
      throw new Error('Błąd autoryzacji');
    }
    
    return response.json();
  } catch (error) {
    // W przypadku błędu sieciowego lub innego, usuń token
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    throw error;
  }
};


export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }
  
  const response = await fetch(`${API_BASE}/api/auth/update-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Błąd podczas aktualizacji profilu');
  }
  
  return response.json();
};


