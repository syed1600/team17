import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/appointments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }
      
      // Update appointment in local state
      setAppointments(appointments.map(apt => 
        apt._id === id ? { ...apt, status: newStatus } : apt
      ));
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert('Failed to update appointment status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
      
      // Remove appointment from local state
      setAppointments(appointments.filter(apt => apt._id !== id));
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert('Failed to delete appointment');
    }
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
        <button 
          onClick={fetchAppointments}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {t('refresh')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('appointmentManagement')}</h2>
        <div className="flex space-x-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('allAppointments')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="confirmed">{t('confirmed')}</option>
            <option value="declined">{t('declined')}</option>
            <option value="cancelled">{t('cancelled')}</option>
          </select>
          <button 
            onClick={fetchAppointments}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('refresh')}
          </button>
        </div>
      </div>
      
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('noAppointments')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">{t('customer')}</th>
                <th className="py-3 px-4 text-left">{t('service')}</th>
                <th className="py-3 px-4 text-left">{t('dateTime')}</th>
                <th className="py-3 px-4 text-left">{t('status')}</th>
                <th className="py-3 px-4 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{appointment.customerName}</div>
                    <div className="text-sm text-gray-500">{appointment.customerEmail}</div>
                    <div className="text-sm text-gray-500">{appointment.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4">
                    {appointment.service}
                  </td>
                  <td className="py-3 px-4">
                    <div>{formatDate(appointment.date)}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'declined' ? 'bg-red-100 text-red-800' :
                      appointment.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(appointment.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                          >
                            {t('confirm')}
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment._id, 'declined')}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                          >
                            {t('decline')}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
