import React, { useState, useEffect } from 'react';
import './App.css';
import AppointmentForm from './components/AppointmentForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Wrap the main app content with the language provider
function AppContent() {
  const { t, language, toggleLanguage } = useLanguage();
  const [view, setView] = useState('booking'); // 'booking', 'admin-login', or 'admin-dashboard'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Check if admin was previously authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);
  
  const handleAdminLogin = (status) => {
    setIsAdminAuthenticated(status);
    localStorage.setItem('adminAuthenticated', status);
  };
  
  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setView('booking');
  };
  
  const handleViewChange = (newView) => {
    if (newView === 'admin-dashboard' && !isAdminAuthenticated) {
      setView('admin-login');
    } else {
      setView(newView);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white shadow">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
          <h1 className="text-2xl font-bold">Barbershop Appointments</h1>
          
          <div className="flex items-center mt-2 md:mt-0">
            {/* Language Toggle Button */}
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 mr-4 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-100 transition-colors shadow-md"
            >
              {language === 'en' ? t('switchToSpanish') : t('switchToEnglish')}
            </button>
            
            <nav className="flex">
              <button 
                onClick={() => handleViewChange('booking')} 
                className={`mr-4 hover:text-blue-200 transition-colors ${view === 'booking' ? 'font-bold underline' : ''}`}
              >
                {t('bookAppointment')}
              </button>
              {isAdminAuthenticated ? (
                <>
                  <button 
                    onClick={() => handleViewChange('admin-dashboard')} 
                    className={`mr-4 hover:text-blue-200 transition-colors ${view === 'admin-dashboard' ? 'font-bold underline' : ''}`}
                  >
                    {t('adminDashboard')}
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="hover:text-blue-200 transition-colors"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleViewChange('admin-dashboard')} 
                  className={`hover:text-blue-200 transition-colors ${view === 'admin-login' ? 'font-bold underline' : ''}`}
                >
                  {t('adminLogin')}
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {view === 'booking' && <AppointmentForm />}
        {view === 'admin-login' && <AdminLogin onLogin={handleAdminLogin} />}
        {view === 'admin-dashboard' && isAdminAuthenticated && <AdminDashboard />}
      </main>
      
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto px-4 text-center">
          <p>{t('copyright')}</p>
        </div>
      </footer>
    </div>
  );
}

// Main App component with Provider
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
