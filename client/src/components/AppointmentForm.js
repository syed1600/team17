import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import uiConfig from '../config/uiConfig';

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
    <div className={uiConfig.components.card.default}>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{t('bookYourAppointment')}</h2>
      
      {submitMessage && (
        <div className={submitMessage.type === 'success' ? uiConfig.components.alert.success : uiConfig.components.alert.error}>
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
            className={uiConfig.components.input.default}
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
            className={uiConfig.components.input.default}
          />
        </div>
        
        {/* Rest of form fields... */}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={isSubmitting ? 
            uiConfig.components.button.primary + ' ' + uiConfig.components.button.disabled : 
            uiConfig.components.button.primary}
        >
          {isSubmitting ? t('booking') : t('book')}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
