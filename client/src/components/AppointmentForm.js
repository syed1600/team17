import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AppointmentForm = () => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    service: 'haircut',
    date: '',
    time: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Generate available time slots from 9am to 5pm
  useEffect(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const formattedHour = hour <= 12 ? hour : hour - 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      slots.push(`${formattedHour}:00 ${ampm}`);
    }
    setTimeSlots(slots);
  }, []);

  // Check availability when date or time changes
  useEffect(() => {
    if (formData.date && formData.time) {
      checkAvailability(formData.date, formData.time);
    }
  }, [formData.date, formData.time]);

  const checkAvailability = async (date, time) => {
    if (!date || !time) return;
    
    setIsCheckingAvailability(true);
    try {
      const response = await fetch(`/api/appointments/check-availability?date=${date}&time=${time}`);
      const data = await response.json();
      
      if (!data.available) {
        setSubmitMessage({
          type: 'warning',
          text: 'This time slot is already booked. Please select a different time.'
        });
      } else {
        setSubmitMessage(null);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear any warning messages when changing date or time
    if (name === 'date' || name === 'time') {
      if (submitMessage?.type === 'warning') {
        setSubmitMessage(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't submit if time slot is unavailable
    if (submitMessage?.type === 'warning') {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Sending request to API');
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (error) {
        console.error('Error parsing response:', error);
        responseData = { message: 'Error parsing server response' };
      }
      
      if (response.ok) {
        setSubmitMessage({ type: 'success', text: t('appointmentBooked') });
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          service: 'haircut',
          date: '',
          time: '',
          notes: ''
        });
      } else {
        const errorMsg = responseData.message || t('bookingFailed');
        setSubmitMessage({ 
          type: 'error', 
          text: `${t('bookingFailed')} ${errorMsg}` 
        });
      }
    } catch (error) {
      console.error('Network error details:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: `${t('networkError')} ${error.message}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{t('bookYourAppointment')}</h2>
      
      {submitMessage && (
        <div className={
          submitMessage.type === 'success' ? 'p-3 mb-4 rounded bg-green-100 text-green-700' : 
          submitMessage.type === 'warning' ? 'p-3 mb-4 rounded bg-yellow-100 text-yellow-700' :
          'p-3 mb-4 rounded bg-red-100 text-red-700'
        }>
          {submitMessage.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="customerName">
            {t('fullName')}
          </label>
          <input
            id="customerName"
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="customerEmail">
            {t('emailAddress')}
          </label>
          <input
            id="customerEmail"
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="customerPhone">
            {t('phoneNumber')}
          </label>
          <input
            id="customerPhone"
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="service">
            {t('service')}
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="haircut">{t('haircut')}</option>
            <option value="beard-trim">{t('beardTrim')}</option>
            <option value="haircut-and-beard">{t('haircutBeard')}</option>
            <option value="kids-haircut">{t('kidsHaircut')}</option>
            <option value="senior-haircut">{t('seniorHaircut')}</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="date">
            {t('date')}
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="time">
            {t('time')}
          </label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('selectTime')}</option>
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          {isCheckingAvailability && (
            <p className="text-sm text-blue-600 mt-1">Checking availability...</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="notes">
            {t('notes')}
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder={t('notesPlaceholder')}
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || submitMessage?.type === 'warning'}
          className={`w-full ${
            isSubmitting || submitMessage?.type === 'warning'
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
        >
          {isSubmitting ? t('booking') : t('book')}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
