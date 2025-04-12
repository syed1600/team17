import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [todayCount, setTodayCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching appointments...');
      const response = await fetch('/api/appointments');
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Appointments data:', data);
      
      // Make sure we have an array
      const appointmentsArray = Array.isArray(data) ? data : [];
      
      setAppointments(appointmentsArray);

      // Count today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointmentsArray.filter(apt => {
        const aptDate = new Date(apt.date).toISOString().split('T')[0];
        return aptDate === today;
      });
      setTodayCount(todayAppts.length);

      // Count pending appointments
      const pendingAppts = appointmentsArray.filter(apt => apt.status === 'pending');
      setPendingCount(pendingAppts.length);
      
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(`Failed to load appointments: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status} ${response.statusText}`);
      }
      
      // Update appointment in local state
      setAppointments(appointments.map(apt => 
        apt._id === id ? { ...apt, status: newStatus } : apt
      ));

      // Update pending count
      if (newStatus !== 'pending' || appointments.find(apt => apt._id === id).status === 'pending') {
        const newPendingCount = appointments.filter(apt => 
          apt._id === id ? newStatus === 'pending' : apt.status === 'pending'
        ).length;
        setPendingCount(newPendingCount);
      }
      
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete appointment: ${response.status} ${response.statusText}`);
      }
      
      // Get the appointment before removing it
      const appointment = appointments.find(apt => apt._id === id);
      
      // Remove appointment from local state
      setAppointments(appointments.filter(apt => apt._id !== id));
      
      // Update counts if needed
      if (appointment.status === 'pending') {
        setPendingCount(pendingCount - 1);
      }
      
      const today = new Date().toISOString().split('T')[0];
      const aptDate = new Date(appointment.date).toISOString().split('T')[0];
      if (aptDate === today) {
        setTodayCount(todayCount - 1);
      }
      
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert(`Failed to delete appointment: ${err.message}`);
    }
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter);

  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        <button 
          onClick={fetchAppointments}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {t('refresh')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800">Total Appointments</h3>
          <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-100">
          <h3 className="text-lg font-semibold text-yellow-800">Pending Appointments</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow border border-green-100">
          <h3 className="text-lg font-semibold text-green-800">Today's Appointments</h3>
          <p className="text-3xl font-bold text-green-600">{todayCount}</p>
        </div>
      </div>
      
      {/* Appointment Management */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('appointmentManagement')}</h2>
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
          <div className="text-center py-8 text-gray-500 text-lg">
            {t('noAppointments')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">{t('customer')}</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">{t('service')}</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">{t('dateTime')}</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">{t('status')}</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">{t('actions')}</th>
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
                      <div className="font-medium">{formatDate(appointment.date)}</div>
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
                      <div className="flex flex-wrap gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              {t('confirm')}
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'declined')}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              {t('decline')}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
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
    </div>
  );
};

export default AdminDashboard;
