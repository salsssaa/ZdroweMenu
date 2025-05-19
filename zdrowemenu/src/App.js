import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm, RegisterForm } from './auth/AuthPages';
import { isAuthenticated } from './auth/AuthService';
import './index.css';
import Dashboard from './Dashboard';
import Navbar from './components/Navbar';

// Importy dla nowych stron
import Produkty from './pages/Produkty';
import Jadlospis from './pages/Jadlospis';
import Profil from './pages/Profil';

// Wrapper dla chronionych tras z Navbarem
const PrivateLayout = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900">
      <Navbar />
      <div className="flex-grow w-full">
        {children}
      </div>
    </div>
  );
};

// Główny komponent aplikacji
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full">
        <Routes>
          {/* Publiczne ścieżki */}
          <Route path="/login" element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginForm />
          } />
          <Route path="/register" element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <RegisterForm />
          } />
          
          {/* Chronione ścieżki z Navbarem */}
          <Route path="/dashboard" element={
            <PrivateLayout>
              <Dashboard />
            </PrivateLayout>
          } />
          <Route path="/produkty" element={
            <PrivateLayout>
              <Produkty />
            </PrivateLayout>
          } />
          <Route path="/jadlospis" element={
            <PrivateLayout>
              <Jadlospis />
            </PrivateLayout>
          } />
          <Route path="/profil" element={
            <PrivateLayout>
              <Profil />
            </PrivateLayout>
          } />
          
          {/* Przekierowanie z głównej strony */}
          <Route path="/" element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
