import React, { useState } from 'react';
import ApiService from '../services/ApiService';

const Produkty = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const searchProducts = async (page = 1) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ApiService.searchProducts(query, page);
      setProducts(result.produkty);
      setTotalResults(result.całkowita_liczba);
      setCurrentPage(page);
    } catch (err) {
      setError("Błąd podczas wyszukiwania produktów: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts(1);
  };

  const showProductDetails = async (productId) => {
    try {
      const product = await ApiService.getProduct(productId);
      setSelectedProduct(product);
      
      // Sprawdź kompatybilność produktu z dietą użytkownika
      if (userId) {
        const compatibilityData = await ApiService.checkProductCompatibility(productId, userId);
        setCompatibility(compatibilityData);
      }
    } catch (err) {
      console.error("Błąd podczas pobierania szczegółów produktu:", err);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="w-full px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Wyszukiwanie produktów</h2>
          
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Wpisz nazwę produktu..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <button 
                type="submit" 
                className="absolute inset-y-0 right-0 px-4 text-emerald-400 hover:text-emerald-300"
              >
                Szukaj
              </button>
            </div>
          </form>
          
          {error && (
            <div className="bg-red-900 text-red-100 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-emerald-500"
                      onClick={() => showProductDetails(product.id)}
                    >
                      <div className="flex items-center">
                        {product.url_obrazka && (
                          <img 
                            src={product.url_obrazka} 
                            alt={product.nazwa} 
                            className="w-16 h-16 object-contain mr-4 rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-white">{product.nazwa}</h3>
                          <p className="text-sm text-gray-400">{product.marka}</p>
                          {product.wartosci_odzywcze?.kalorie && (
                            <p className="text-sm text-emerald-400">{product.wartosci_odzywcze.kalorie} kcal/100g</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Paginacja */}
                  {totalResults > products.length && (
                    <div className="flex justify-center mt-6 space-x-2">
                      <button 
                        onClick={() => searchProducts(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
                      >
                        Poprzednia
                      </button>
                      <span className="px-4 py-2">
                        Strona {currentPage}
                      </span>
                      <button 
                        onClick={() => searchProducts(currentPage + 1)} 
                        className="px-4 py-2 bg-gray-700 rounded-lg"
                      >
                        Następna
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                query && <p className="text-gray-400 text-center my-8">Brak wyników dla "{query}"</p>
              )}
            </>
          )}
        </div>
        
        {/* Szczegóły produktu */}
        {selectedProduct && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-emerald-400">{selectedProduct.nazwa}</h2>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-white"
              >
                Zamknij
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {selectedProduct.url_obrazka && (
                  <img 
                    src={selectedProduct.url_obrazka} 
                    alt={selectedProduct.nazwa} 
                    className="w-full max-w-xs mx-auto rounded-lg mb-4"
                  />
                )}
                <p className="text-gray-300"><span className="font-medium">Marka:</span> {selectedProduct.marka || "Nieznana"}</p>
                <p className="text-gray-300"><span className="font-medium">Kod kreskowy:</span> {selectedProduct.id}</p>
                
                {/* Kompatybilność z dietą */}
                {compatibility && (
                  <div className="mt-4 p-4 rounded-lg bg-gray-900">
                    <h3 className="text-lg font-semibold text-emerald-400 mb-2">Kompatybilność z Twoją dietą</h3>
                    
                    {compatibility.jest_kompatybilny ? (
                      <div className="text-green-400 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Produkt jest zgodny z Twoją dietą {compatibility.dieta}
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-400 flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Produkt nie jest zgodny z Twoją dietą {compatibility.dieta}
                        </div>
                        
                        {compatibility.problemy_alergenow.length > 0 && (
                          <div className="mt-2">
                            <p className="text-amber-400 font-medium">Alergeny:</p>
                            <ul className="list-disc pl-5 text-gray-300">
                              {compatibility.problemy_alergenow.map((problem, index) => (
                                <li key={index}>{problem}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {compatibility.problemy_diety.length > 0 && (
                          <div className="mt-2">
                            <p className="text-amber-400 font-medium">Problemy z dietą:</p>
                            <ul className="list-disc pl-5 text-gray-300">
                              {compatibility.problemy_diety.map((problem, index) => (
                                <li key={index}>{problem}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Wartości odżywcze (na 100g)</h3>
                <div className="space-y-2">
                  {selectedProduct.wartosci_odzywcze?.kalorie && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Kalorie:</span>
                      <span className="font-medium">{selectedProduct.wartosci_odzywcze.kalorie} kcal</span>
                    </div>
                  )}
                  {selectedProduct.wartosci_odzywcze?.bialko && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Białko:</span>
                      <span className="font-medium">{selectedProduct.wartosci_odzywcze.bialko} g</span>
                    </div>
                  )}
                  {selectedProduct.wartosci_odzywcze?.weglowodany && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Węglowodany:</span>
                      <span className="font-medium">{selectedProduct.wartosci_odzywcze.weglowodany} g</span>
                    </div>
                  )}
                  {selectedProduct.wartosci_odzywcze?.tluszcze && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tłuszcze:</span>
                      <span className="font-medium">{selectedProduct.wartosci_odzywcze.tluszcze} g</span>
                    </div>
                  )}
                  {selectedProduct.wartosci_odzywcze?.blonnik && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Błonnik:</span>
                      <span className="font-medium">{selectedProduct.wartosci_odzywcze.blonnik} g</span>
                    </div>
                  )}
                  {selectedProduct.wartosci_odzywcze?.sol && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sól:</span>
                      <span className="font-medium">{selectedProduct.wartosci_odzywcze.sol} g</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-emerald-400 mt-6 mb-2">Składniki</h3>
                <p className="text-gray-300 text-sm">{selectedProduct.skladniki || "Brak danych o składnikach"}</p>
                
                <h3 className="text-lg font-semibold text-emerald-400 mt-6 mb-2">Alergeny</h3>
                <p className="text-gray-300 text-sm">{selectedProduct.alergeny || "Brak danych o alergenach"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Produkty;
