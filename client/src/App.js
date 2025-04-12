import React, { useState, useEffect } from 'react';
import './App.css';
import AppointmentForm from './components/AppointmentForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import uiConfig from './config/uiConfig';

// Wrap the main app content with the language provider
function AppContent() {
  const { t, language, toggleLanguage } = useLanguage();
  const [view, setView] = useState('booking'); // 'booking', 'admin-login', or 'admin-dashboard'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Check if admin was previously authenticated - using sessionStorage instead of localStorage
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAdminAuthenticated(true);
      setView('admin-dashboard');
    }
  }, []);

  // Set up event listener for page unload
  useEffect(() => {
    const handleUnload = () => {
      // Clear authentication on page close/refresh
      sessionStorage.removeItem('adminAuthenticated');
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleUnload);
    
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  
  const handleAdminLogin = (status) => {
    setIsAdminAuthenticated(status);
    // Store in sessionStorage (clears when browser tab is closed) rather than localStorage
    sessionStorage.setItem('adminAuthenticated', status);
    
    // Automatically redirect to admin dashboard on successful login
    if (status) {
      setView('admin-dashboard');
    }
  };
  
  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
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
      <header className={uiConfig.colors.primary.default + " text-white shadow"}>
        <div className={uiConfig.components.layout.container + " py-4 flex flex-wrap justify-between items-center"}>
          <h1 className="text-2xl font-bold">{uiConfig.branding.name}</h1>
          
          <div className="flex items-center mt-2 md:mt-0">
            {/* Language Toggle Button */}
            <button 
              onClick={toggleLanguage}
              className={uiConfig.languageToggle.button}
            >
              {language === 'en' ? t('switchToSpanish') : t('switchToEnglish')}
            </button>
            
            <nav className="flex ml-4">
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
      
      <main className={uiConfig.components.layout.container + " py-8 flex-grow"}>
        {view === 'booking' && <AppointmentForm />}
        {view === 'admin-login' && <AdminLogin onLogin={handleAdminLogin} />}
        {view === 'admin-dashboard' && isAdminAuthenticated && <AdminDashboard />}
      </main>
      
      <footer className={uiConfig.colors.secondary.default + " text-white p-4"}>
        <div className={uiConfig.components.layout.container + " text-center"}>
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
