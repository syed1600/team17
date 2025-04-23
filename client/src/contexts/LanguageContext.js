import React, { createContext, useState, useContext } from 'react';

// Define translations
const translations = {
  en: {
    // Header
    bookAppointment: 'Book Appointment',
    adminDashboard: 'Admin Dashboard',
    logout: 'Logout',
    adminLogin: 'Admin Login',
    barbershopAppointments: 'Barbershop Appointments',
    
    // Booking Form
    bookYourAppointment: 'Book Your Appointment',
    appointmentBooked: 'Appointment booked successfully!',
    bookingFailed: 'Failed to book appointment.',
    networkError: 'Network error. Please try again later.',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    service: 'Service',
    haircut: 'Haircut ($25)',
    beardTrim: 'Beard Trim ($15)',
    haircutBeard: 'Haircut & Beard ($35)',
    kidsHaircut: 'Kids Haircut ($20)',
    seniorHaircut: 'Senior Haircut ($20)',
    date: 'Date',
    time: 'Time',
    selectTime: 'Select a time',
    notes: 'Notes',
    notesPlaceholder: 'Any special requests or information',
    booking: 'Booking...',
    book: 'Book Appointment',
    
    // Admin Login
    adminLoginTitle: 'Admin Login',
    invalidCredentials: 'Invalid username or password',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    
    // Admin Dashboard
    appointmentManagement: 'Appointment Management',
    allAppointments: 'All Appointments',
    pending: 'Pending',
    confirmed: 'Confirmed',
    declined: 'Declined',
    cancelled: 'Cancelled',
    refresh: 'Refresh',
    noAppointments: 'No appointments found.',
    customer: 'Customer',
    dateTime: 'Date & Time',
    status: 'Status',
    actions: 'Actions',
    confirm: 'Confirm',
    decline: 'Decline',
    delete: 'Delete',
    loading: 'Loading appointments...',
    totalAppointments: 'Total Appointments',
    pendingAppointments: 'Pending Appointments',
    todaysAppointments: 'Today\'s Appointments',
    viewNotes: 'View Notes',
    hideNotes: 'Hide Notes',
    noNotes: 'No notes',
    
    // Footer
    copyright: '© 2025 Barbershop Booking. All rights reserved.',
    
    // Language
    switchToSpanish: 'Español',
    switchToEnglish: 'English'
  },
  es: {
    // Header
    bookAppointment: 'Reservar Cita',
    adminDashboard: 'Panel de Administración',
    logout: 'Cerrar Sesión',
    adminLogin: 'Acceso Admin',
    barbershopAppointments: 'Citas de Barbería',
    
    // Booking Form
    bookYourAppointment: 'Reserve Su Cita',
    appointmentBooked: '¡Cita reservada con éxito!',
    bookingFailed: 'Error al reservar la cita.',
    networkError: 'Error de red. Por favor, inténtelo más tarde.',
    fullName: 'Nombre Completo',
    emailAddress: 'Correo Electrónico',
    phoneNumber: 'Número de Teléfono',
    service: 'Servicio',
    haircut: 'Corte de Pelo ($25)',
    beardTrim: 'Recorte de Barba ($15)',
    haircutBeard: 'Corte y Barba ($35)',
    kidsHaircut: 'Corte para Niños ($20)',
    seniorHaircut: 'Corte para Mayores ($20)',
    date: 'Fecha',
    time: 'Hora',
    selectTime: 'Seleccionar una hora',
    notes: 'Notas',
    notesPlaceholder: 'Cualquier petición especial o información',
    booking: 'Reservando...',
    book: 'Reservar Cita',
    
    // Admin Login
    adminLoginTitle: 'Acceso de Administrador',
    invalidCredentials: 'Usuario o contraseña incorrectos',
    username: 'Usuario',
    password: 'Contraseña',
    login: 'Iniciar Sesión',
    
    // Admin Dashboard
    appointmentManagement: 'Gestión de Citas',
    allAppointments: 'Todas las Citas',
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    declined: 'Rechazada',
    cancelled: 'Cancelada',
    refresh: 'Actualizar',
    noAppointments: 'No se encontraron citas.',
    customer: 'Cliente',
    dateTime: 'Fecha y Hora',
    status: 'Estado',
    actions: 'Acciones',
    confirm: 'Confirmar',
    decline: 'Rechazar',
    delete: 'Eliminar',
    loading: 'Cargando citas...',
    totalAppointments: 'Total de Citas',
    pendingAppointments: 'Citas Pendientes',
    todaysAppointments: 'Citas de Hoy',
    viewNotes: 'Ver Notas',
    hideNotes: 'Ocultar Notas',
    noNotes: 'Sin notas',
    
    // Footer
    copyright: '© 2025 Barbershop Booking. Todos los derechos reservados.',
    
    // Language
    switchToSpanish: 'Español',
    switchToEnglish: 'English'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
