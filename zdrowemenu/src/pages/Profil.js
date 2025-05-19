import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

const Profil = () => {
  const [user, setUser] = useState(null);
  const [diets, setDiets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    imie: '',
    nazwisko: '',
    dieta_id: '',
    alergie: '',
    cel_kalorii: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Pobierz dane użytkownika
        const userData = await ApiService.getCurrentUser();
        setUser(userData);
        
        // Ustaw dane formularza
        setFormData({
          imie: userData.imie || '',
          nazwisko: userData.nazwisko || '',
          dieta_id: userData.dieta_id || '',
          alergie: userData.alergie || '',
          cel_kalorii: userData.cel_kalorii || ''
        });
        
        // Pobierz dostępne diety
        const dietsData = await ApiService.getDiets();
        setDiets(dietsData);
      } catch (err) {
        console.error("Błąd podczas pobierania danych:", err);
        setError("Nie udało się pobrać danych użytkownika");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
    setIsLoading(true);
    
    try {
      // Tu powinna być implementacja aktualizacji danych użytkownika
      // Obecnie backend nie ma endpointu do aktualizacji, więc to jest tylko przykład
      // await ApiService.updateUser(formData);
      
      // Symulacja aktualizacji
      setUser({
        ...user,
        ...formData,
        dieta_id: parseInt(formData.dieta_id) || null,
        cel_kalorii: parseInt(formData.cel_kalorii) || null
      });
      
      setIsEditing(false);
    } catch (err) {
      setError("Nie udało się zaktualizować danych");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDiet = () => {
    if (!user?.dieta_id || !diets.length) return "Nie wybrano";
    const diet = diets.find(d => d.id === user.dieta_id);
    return diet ? diet.nazwa : "Nie wybrano";
  };

  if (isLoading && !user) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Mój profil</h2>
          
          {error && (
            <div className="bg-red-900 text-red-100 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          {!isEditing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Dane osobowe</h3>
                  <p className="text-gray-300 mb-2"><span className="font-medium">Imię:</span> {user?.imie || 'Nie podano'}</p>
                  <p className="text-gray-300 mb-2"><span className="font-medium">Nazwisko:</span> {user?.nazwisko || 'Nie podano'}</p>
                  <p className="text-gray-300 mb-2"><span className="font-medium">Email:</span> {user?.email || 'Nie podano'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Ustawienia diety</h3>
                  <p className="text-gray-300 mb-2"><span className="font-medium">Dieta:</span> {getCurrentDiet()}</p>
                  <p className="text-gray-300 mb-2"><span className="font-medium">Cel kalorii:</span> {user?.cel_kalorii || 'Nie ustawiono'}</p>
                  <p className="text-gray-300 mb-2">
                    <span className="font-medium">Alergie:</span> 
                    {user?.alergie ? (
                      <span className="ml-2">
                        {typeof user.alergie === 'string' 
                          ? user.alergie 
                          : Array.isArray(user.alergie) 
                            ? user.alergie.join(', ') 
                            : 'Brak'}
                      </span>
                    ) : (
                      ' Brak'
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  Edytuj dane
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="imie" className="block text-gray-300 font-medium mb-2">
                  Imię
                </label>
                <input
                  type="text"
                  id="imie"
                  name="imie"
                  value={formData.imie}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
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
                  <option value="">Wybierz dietę</option>
                  {diets.map(dieta => (
                    <option key={dieta.id} value={dieta.id}>
                      {dieta.nazwa}
                    </option>
                  ))}
                </select>
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
              
              <div className="mb-4 md:col-span-2">
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
              
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex-1"
                >
                  {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  Anuluj
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profil;
