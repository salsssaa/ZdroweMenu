import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

const Jadlospis = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [jadlospis, setJadlospis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    fetchJadlospis(selectedDate);
  }, [selectedDate]);

  const fetchJadlospis = async (date) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.getMenu(date);
      setJadlospis(data);
      
      // Sprawdź kompatybilność jadłospisu z dietą użytkownika
      if (userId) {
        try {
          const compatibilityData = await ApiService.checkMenuCompatibility(userId, date);
          setCompatibility(compatibilityData);
        } catch (compatError) {
          console.error("Błąd podczas sprawdzania kompatybilności:", compatError);
        }
      }
    } catch (err) {
      setError(`Nie znaleziono jadłospisu na dzień ${date}`);
      setJadlospis(null);
      setCompatibility(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pl-PL', options);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="w-full px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Jadłospis</h2>
          
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">Wybierz datę</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-64 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg text-center">
              <p className="text-red-100">{error}</p>
            </div>
          ) : jadlospis ? (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Jadłospis na {formatDate(selectedDate)}
              </h3>
              
              {/* Kompatybilność jadłospisu */}
              {compatibility && (
                <div className={`p-4 rounded-lg mb-6 ${
                  compatibility.jest_kompatybilny 
                    ? 'bg-green-900 bg-opacity-30' 
                    : 'bg-red-900 bg-opacity-30'
                }`}>
                  <h4 className="font-medium text-lg">
                    {compatibility.jest_kompatybilny 
                      ? 'Jadłospis jest zgodny z Twoją dietą' 
                      : 'Jadłospis nie jest w pełni zgodny z Twoją dietą'}
                  </h4>
                  
                  {!compatibility.jest_kompatybilny && (
                    <div className="mt-2">
                      {Object.keys(compatibility.problemy_alergenow).length > 0 && (
                        <div className="mb-3">
                          <p className="text-amber-400 font-medium">Problemy z alergenami:</p>
                          {Object.entries(compatibility.problemy_alergenow).map(([posilek, problemy]) => (
                            <div key={posilek} className="ml-4 mt-1">
                              <p className="text-white">{posilek}:</p>
                              <ul className="list-disc pl-5 text-gray-300">
                                {problemy.map((problem, index) => (
                                  <li key={index}>{problem}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {Object.keys(compatibility.problemy_diety).length > 0 && (
                        <div className="mb-3">
                          <p className="text-amber-400 font-medium">Problemy z dietą:</p>
                          {Object.entries(compatibility.problemy_diety).map(([posilek, problemy]) => (
                            <div key={posilek} className="ml-4 mt-1">
                              <p className="text-white">{posilek}:</p>
                              <ul className="list-disc pl-5 text-gray-300">
                                {problemy.map((problem, index) => (
                                  <li key={index}>{problem}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {compatibility.problemy_kalorii.length > 0 && (
                    <div className="mt-2">
                      <p className="text-amber-400 font-medium">Uwagi dotyczące kalorii:</p>
                      <ul className="list-disc pl-5 text-gray-300">
                        {compatibility.problemy_kalorii.map((problem, index) => (
                          <li key={index}>{problem}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Śniadanie */}
              <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                <h4 className="font-medium text-lg text-white">Śniadanie</h4>
                <div className="mt-2">
                  {jadlospis.jadlospis.sniadanie.posilki.map((item, index) => (
                    <div key={index} className="flex justify-between py-1 border-b border-gray-700">
                      <span className="text-gray-300">{item.nazwa}</span>
                      <span className="text-gray-400">{item.ilosc} {item.jednostka} ({item.kalorie} kcal)</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Obiad */}
              <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                <h4 className="font-medium text-lg text-white">Obiad</h4>
                <div className="mt-2">
                  {jadlospis.jadlospis.obiad.posilki.map((item, index) => (
                    <div key={index} className="flex justify-between py-1 border-b border-gray-700">
                      <span className="text-gray-300">{item.nazwa}</span>
                      <span className="text-gray-400">{item.ilosc} {item.jednostka} ({item.kalorie} kcal)</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Kolacja */}
              <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                <h4 className="font-medium text-lg text-white">Kolacja</h4>
                <div className="mt-2">
                  {jadlospis.jadlospis.kolacja.posilki.map((item, index) => (
                    <div key={index} className="flex justify-between py-1 border-b border-gray-700">
                      <span className="text-gray-300">{item.nazwa}</span>
                      <span className="text-gray-400">{item.ilosc} {item.jednostka} ({item.kalorie} kcal)</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Przekąski */}
              {jadlospis.jadlospis.przekaski && jadlospis.jadlospis.przekaski.length > 0 && (
                <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                  <h4 className="font-medium text-lg text-white">Przekąski</h4>
                  {jadlospis.jadlospis.przekaski.map((przekaska, przekaskaIndex) => (
                    <div key={przekaskaIndex} className="mt-2">
                      <p className="text-emerald-400">{przekaska.nazwa}</p>
                      <div className="mt-1">
                        {przekaska.posilki.map((item, index) => (
                          <div key={index} className="flex justify-between py-1 border-b border-gray-700">
                            <span className="text-gray-300">{item.nazwa}</span>
                            <span className="text-gray-400">{item.ilosc} {item.jednostka} ({item.kalorie} kcal)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Podsumowanie kalorii */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium text-white">Suma kalorii:</span>
                  <span className="font-bold text-emerald-400">
                    {jadlospis.suma_kalorii} kcal
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center my-8">Wybierz datę, aby zobaczyć jadłospis</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jadlospis;
