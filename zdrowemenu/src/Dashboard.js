import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from './UserContext'; // zamiast './context/UserContext'


const Dashboard = () => {
  const { user, fetchUser, isLoading } = useUser();
  const [jadlospis, setJadlospis] = useState(null);
  const [jadlospisLoading, setJadlospisLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Pobierz dane użytkownika z kontekstu jeśli nie ma
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  useEffect(() => {
    // Pobierz jadłospis gdy user jest dostępny
    const fetchJadlospis = async () => {
      if (!user) return;
      
      try {
        setJadlospisLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const jadlospisData = await fetch(`http://localhost:8000/api/jadlospis/${today}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (jadlospisData.ok) {
          const jadlospisJson = await jadlospisData.json();
          setJadlospis(jadlospisJson);
        }
      } catch (menuError) {
        console.log("Brak jadłospisu na dziś:", menuError);
      } finally {
        setJadlospisLoading(false);
      }
    };

    fetchJadlospis();
  }, [user]);

  // Funkcje nawigacyjne
  const handleSearchProducts = () => navigate("/produkty");
  const handleCheckMenu = () => navigate("/jadlospis");
  const handleEditProfile = () => navigate("/profil");

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-900 text-white">
        <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-6">
          <p>{error}</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-2 text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Przejdź do logowania
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Główna zawartość */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-emerald-400">Witaj, {user?.imie || "Użytkowniku"}!</h2>
            <p className="text-gray-400 mt-2">Twój panel zarządzania dietą</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Informacje o diecie */}
            <div className="bg-gray-900 bg-opacity-50 p-5 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Twoja dieta</h3>
              <p className="text-gray-300">
                {user?.dieta?.nazwa || "Brak wybranej diety"}
              </p>
              {user?.dieta && (
                <p className="text-sm text-gray-500 mt-2">
                  {user.dieta.opis || "Brak opisu diety"}
                </p>
              )}
            </div>

            {/* Cel kaloryczny */}
            <div className="bg-gray-900 bg-opacity-50 p-5 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Cel kaloryczny</h3>
              <div className="flex items-end">
                <span className="text-3xl font-bold text-blue-400">
                  {user?.cel_kalorii || "Nie ustawiono"}
                </span>
                <span className="ml-1 text-gray-400">kcal/dzień</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Twój dzienny cel kaloryczny
              </p>
            </div>

            {/* Alergie */}
            <div className="bg-gray-900 bg-opacity-50 p-5 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">Alergie</h3>
              {user?.alergie && Array.isArray(user.alergie) && user.alergie.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.alergie.map((alergia, index) => (
                    <span key={index} className="px-2 py-1 bg-amber-900 text-amber-200 rounded-full text-sm">
                      {alergia}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Brak zdefiniowanych alergii</p>
              )}
            </div>
          </div>
        </div>

        {/* Jadłospis */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-emerald-400 mb-4">Twój dzisiejszy jadłospis</h3>
          
          {jadlospisLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : jadlospis ? (
            <div className="space-y-4">
              {/* Śniadanie */}
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-medium text-lg text-white">Śniadanie</h4>
                <p className="text-gray-300">{jadlospis.sniadanie || "Brak danych"}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {jadlospis.sniadanie_kalorie ? `${jadlospis.sniadanie_kalorie} kcal` : ""}
                </p>
              </div>
              
              {/* Obiad */}
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-medium text-lg text-white">Obiad</h4>
                <p className="text-gray-300">{jadlospis.obiad || "Brak danych"}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {jadlospis.obiad_kalorie ? `${jadlospis.obiad_kalorie} kcal` : ""}
                </p>
              </div>
              
              {/* Kolacja */}
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-medium text-lg text-white">Kolacja</h4>
                <p className="text-gray-300">{jadlospis.kolacja || "Brak danych"}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {jadlospis.kolacja_kalorie ? `${jadlospis.kolacja_kalorie} kcal` : ""}
                </p>
              </div>
              
              {/* Podsumowanie */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium text-white">Suma kalorii:</span>
                  <span className="font-bold text-emerald-400">
                    {jadlospis.suma_kalorii || "Brak danych"} kcal
                  </span>
                </div>
                
                {user?.cel_kalorii && jadlospis.suma_kalorii && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          (jadlospis.suma_kalorii / user.cel_kalorii) > 1 
                            ? 'bg-red-500' 
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (jadlospis.suma_kalorii / user.cel_kalorii) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round((jadlospis.suma_kalorii / user.cel_kalorii) * 100)}% dziennego celu
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <p className="text-gray-400">Brak jadłospisu na dziś</p>
              <button 
                onClick={handleCheckMenu}
                className="mt-2 text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Sprawdź dostępne jadłospisy
              </button>
            </div>
          )}
        </div>

        {/* Szybkie akcje */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleSearchProducts}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Szukaj produktów
          </button>
          
          <button
            onClick={handleCheckMenu}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Sprawdź jadłospis
          </button>
          
          <button
            onClick={handleEditProfile}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Zmień dane
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
