import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from './AuthService';

// Komponent formularza logowania
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const userData = await loginUser(email, password);
      // Zapisz token w localStorage
      localStorage.setItem('authToken', userData.access_token);
      localStorage.setItem('userId', userData.user_id);
      // Przekieruj do panelu użytkownika
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Nieprawidłowy email lub hasło');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-400">Witaj ponownie</h2>
          <p className="text-gray-400 mt-2">Zaloguj się do swojej zdrowej diety</p>
        </div>

        {error && (
          <div className="bg-red-900 text-red-100 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              placeholder="Twój adres email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 font-medium mb-2">
              Hasło
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              placeholder="Twoje hasło"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logowanie...
              </span>
            ) : (
              'Zaloguj się'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Nie masz jeszcze konta?{' '}
            <button 
              onClick={() => navigate('/register')} 
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Zarejestruj się
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Komponent formularza rejestracji
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    imie: '',
    password: '',
    confirmPassword: '',
    nazwisko: '',
    dieta_id: '',
    alergie: '',
    cel_kalorii: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dietyOptions, setDietyOptions] = useState([]);
  const navigate = useNavigate();

  // Pobieranie dostępnych diet z API
  React.useEffect(() => {
    fetch('http://localhost:8000/api/diety')
      .then(response => response.json())
      .then(data => setDietyOptions(data))
      .catch(error => console.error('Błąd podczas pobierania diet:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Sprawdzenie, czy hasła są zgodne
    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    setIsLoading(true);
    try {
      // Przygotowanie danych do wysłania
      const userData = {
        email: formData.email,
        password: formData.password,
        imie: formData.imie,
        nazwisko: formData.nazwisko || null,
        dieta_id: formData.dieta_id || null,
        alergie: formData.alergie || null,
        cel_kalorii: formData.cel_kalorii ? parseInt(formData.cel_kalorii) : null
      };

      const response = await registerUser(userData);
      
      // Zapisz token w localStorage
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('userId', response.user_id);
      
      // Przekieruj do panelu użytkownika
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Błąd podczas rejestracji. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4 py-8">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-400">Załóż konto</h2>
          <p className="text-gray-400 mt-2">Rozpocznij swoją zdrową przygodę z dietą</p>
        </div>

        {error && (
  <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
    {typeof error === 'string' ? error : (error.message || 'Wystąpił błąd')}
  </div>
)}


        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              placeholder="Twój adres email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="imie" className="block text-gray-300 font-medium mb-2">
              Imię*
            </label>
            <input
              type="text"
              id="imie"
              name="imie"
              value={formData.imie}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              placeholder="Twoje imię"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 font-medium mb-2">
              Hasło*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              placeholder="Twoje hasło"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-300 font-medium mb-2">
              Powtórz hasło*
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              placeholder="Powtórz hasło"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nazwisko" className="block text-gray-300 font-medium mb-2">
              Nazwisko
            </label>
            <input
              type="text"
              id="nazwisko"
              name="nazwisko"
              value={formData.nazwisko}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              placeholder="Twoje nazwisko (opcjonalnie)"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dieta_id" className="block text-gray-300 font-medium mb-2">
              Preferowana dieta
            </label>
            <select
              id="dieta_id"
              name="dieta_id"
              value={formData.dieta_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
            >
              <option value="">Wybierz dietę (opcjonalnie)</option>
              {dietyOptions.map(dieta => (
                <option key={dieta.id} value={dieta.id}>
                  {dieta.nazwa}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="alergie" className="block text-gray-300 font-medium mb-2">
              Alergie pokarmowe
            </label>
            <input
              type="text"
              id="alergie"
              name="alergie"
              value={formData.alergie}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              placeholder="np. gluten, laktoza, orzechy (oddziel przecinkami)"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cel_kalorii" className="block text-gray-300 font-medium mb-2">
              Dzienny cel kalorii
            </label>
            <input
              type="number"
              id="cel_kalorii"
              name="cel_kalorii"
              value={formData.cel_kalorii}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              placeholder="np. 2000"
              min="500"
              max="5000"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Rejestracja...
                </span>
              ) : (
                'Zarejestruj się'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Masz już konto?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Zaloguj się
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export { LoginForm, RegisterForm };
