import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import uiConfig from '../config/uiConfig';

const AdminLogin = ({ onLogin }) => {
  const { t } = useLanguage();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    // Specific credentials as requested
    if (credentials.username === 'admin' && credentials.password === 'ClientPassword123') {
      onLogin(true);
    } else {
      setError(t('invalidCredentials'));
    }
  };

  return (
    <div className={uiConfig.components.card.default + " max-w-md mx-auto"}>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{t('adminLoginTitle')}</h2>
      
      {error && (
        <div className={uiConfig.components.alert.error}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
            {t('username')}
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            className={uiConfig.components.input.default}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
            {t('password')}
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            className={uiConfig.components.input.default}
          />
        </div>
        
        <button
          type="submit"
          className={uiConfig.components.button.primary + " w-full"}
        >
          {t('login')}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
