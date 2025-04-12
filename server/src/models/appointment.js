const mongoose = require('mongoose');

// Define the MongoDB schema
const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Try to create a MongoDB model
let AppointmentModel;
try {
  AppointmentModel = mongoose.model('Appointment', appointmentSchema);
  console.log('Using MongoDB for appointment storage');
} catch (err) {
  console.error('Error creating MongoDB model:', err);
  
  // Fallback to in-memory model
  console.log('Falling back to in-memory appointment storage');
  
  // In-memory store
  const appointments = [];
  let nextId = 1;
  
  AppointmentModel = {
    appointments,
    
    find: function() {
      return Promise.resolve([...this.appointments]);
    },
    
    findById: function(id) {
      const appointment = this.appointments.find(a => a._id === id);
      return Promise.resolve(appointment || null);
    },
    
    create: function(data) {
      const newAppointment = {
        _id: (nextId++).toString(),
        ...data,
        createdAt: new Date()
      };
      
      this.appointments.push(newAppointment);
      return Promise.resolve(newAppointment);
    },
    
    findByIdAndDelete: function(id) {
      const index = this.appointments.findIndex(a => a._id === id);
      if (index === -1) return Promise.resolve(null);
      
      const deleted = this.appointments.splice(index, 1)[0];
      return Promise.resolve(deleted);
    }
  };
}

module.exports = AppointmentModel;
