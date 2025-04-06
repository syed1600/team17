import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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
    
    // For local-only development, use hardcoded credentials
    // In a real app, you would verify against the server
    if (credentials.username === 'admin' && credentials.password === 'barbershop123') {
      onLogin(true);
    } else {
      setError(t('invalidCredentials'));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{t('adminLoginTitle')}</h2>
      
      {error && (
        <div className="p-3 mb-4 rounded bg-red-100 text-red-700">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {t('login')}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
