import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import uiConfig from '../config/uiConfig';

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
      <div className={uiConfig.components.alert.error + " border-l-4 border-red-500"}>
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        <button 
          onClick={fetchAppointments}
          className={uiConfig.components.button.danger + " mt-4"}
        >
          {t('refresh')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Summary */}
      <div className={uiConfig.components.layout.grid}>
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
      <div className={uiConfig.components.card.default}>
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('appointmentManagement')}</h2>
          <div className="flex space-x-2">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className={uiConfig.components.input.default}
            >
              <option value="all">{t('allAppointments')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="confirmed">{t('confirmed')}</option>
              <option value="declined">{t('declined')}</option>
              <option value="cancelled">{t('cancelled')}</option>
            </select>
            <button 
              onClick={fetchAppointments}
              className={uiConfig.components.button.primary}
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
          <div className={uiConfig.components.table.wrapper}>
            <table className={uiConfig.components.table.table}>
              <thead>
                <tr className={uiConfig.components.table.header}>
                  <th className={uiConfig.components.table.headerCell}>{t('customer')}</th>
                  <th className={uiConfig.components.table.headerCell}>{t('service')}</th>
                  <th className={uiConfig.components.table.headerCell}>{t('dateTime')}</th>
                  <th className={uiConfig.components.table.headerCell}>{t('status')}</th>
                  <th className={uiConfig.components.table.headerCell}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody className={uiConfig.components.table.divider}>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className={uiConfig.components.table.row}>
                    <td className={uiConfig.components.table.cell}>
                      <div className="font-medium">{appointment.customerName}</div>
                      <div className="text-sm text-gray-500">{appointment.customerEmail}</div>
                      <div className="text-sm text-gray-500">{appointment.customerPhone}</div>
                    </td>
                    <td className={uiConfig.components.table.cell}>
                      {appointment.service}
                    </td>
                    <td className={uiConfig.components.table.cell}>
                      <div className="font-medium">{formatDate(appointment.date)}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className={uiConfig.components.table.cell}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        uiConfig.colors.status[appointment.status] || ''
                      }`}>
                        {t(appointment.status)}
                      </span>
                    </td>
                    <td className={uiConfig.components.table.cell}>
                      <div className="flex flex-wrap gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                              className={uiConfig.components.button.success + " " + uiConfig.components.button.small}
                            >
                              {t('confirm')}
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'declined')}
                              className={uiConfig.components.button.danger + " " + uiConfig.components.button.small}
                            >
                              {t('decline')}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className={uiConfig.components.button.secondary + " " + uiConfig.components.button.small}
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
