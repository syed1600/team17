import React, { useState } from 'react';
import './App.css';
import AppointmentForm from './components/AppointmentForm';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [view, setView] = useState('booking'); // 'booking' or 'admin'
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Barbershop Booking</h1>
          <div>
            <button 
              onClick={() => setView('booking')} 
              className={`mr-4 ${view === 'booking' ? 'font-bold' : ''}`}
            >
              Book Appointment
            </button>
            <button 
              onClick={() => setView('admin')} 
              className={`${view === 'admin' ? 'font-bold' : ''}`}
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        {view === 'booking' ? <AppointmentForm /> : <AdminDashboard />}
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Barbershop Booking System</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
