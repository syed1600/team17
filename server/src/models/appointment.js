const mongoose = require('mongoose');

// Simple schema since we're not using MongoDB yet
const appointmentSchema = {
  _id: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  service: String,
  date: Date,
  time: String,
  status: String,
  notes: String,
  createdAt: Date
};

// In-memory store for appointments
let appointments = [
  {
    _id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '(555) 123-4567',
    service: 'haircut',
    date: new Date('2025-04-15'),
    time: '10:00 AM',
    status: 'pending',
    notes: 'First time customer',
    createdAt: new Date()
  },
  {
    _id: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '(555) 987-6543',
    service: 'haircut-and-beard',
    date: new Date('2025-04-16'),
    time: '2:00 PM',
    status: 'confirmed',
    notes: '',
    createdAt: new Date()
  }
];

// Model methods
const Appointment = {
  findAll: () => {
    return Promise.resolve([...appointments]);
  },
  
  findById: (id) => {
    const appointment = appointments.find(a => a._id === id);
    return Promise.resolve(appointment || null);
  },
  
  create: (appointmentData) => {
    const newAppointment = {
      _id: Date.now().toString(),
      ...appointmentData,
      status: 'pending',
      createdAt: new Date()
    };
    
    appointments.push(newAppointment);
    return Promise.resolve(newAppointment);
  },
  
  updateStatus: (id, status) => {
    const index = appointments.findIndex(a => a._id === id);
    if (index === -1) return Promise.resolve(null);
    
    appointments[index].status = status;
    return Promise.resolve(appointments[index]);
  },
  
  delete: (id) => {
    const index = appointments.findIndex(a => a._id === id);
    if (index === -1) return Promise.resolve(false);
    
    appointments.splice(index, 1);
    return Promise.resolve(true);
  }
};

module.exports = Appointment;
