import React, { useState } from 'react';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    console.log('Submitting form data:', formData);
    
    try {
      // Use relative URL with proxy
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
        <div className={submitMessage.type === 'success' ? 'p-3 mb-4 rounded bg-green-100 text-green-700' : 'p-3 mb-4 rounded bg-red-100 text-red-700'}>
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
            <option value="9:00 AM">9:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="3:00 PM">3:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
            <option value="5:00 PM">5:00 PM</option>
          </select>
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
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
        >
          {isSubmitting ? t('booking') : t('book')}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
