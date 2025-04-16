const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { inMemoryDB } = require('../server');

// Define a simple schema for appointments
const appointmentSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  service: String,
  date: Date,
  time: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model or use it if it exists
let Appointment;
try {
  Appointment = mongoose.model('Appointment');
} catch (e) {
  Appointment = mongoose.model('Appointment', appointmentSchema);
}

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get all appointments
router.get('/', async (req, res) => {
  try {
    let appointments = [];
    
    if (isMongoConnected()) {
      // If MongoDB is connected, use it
      appointments = await Appointment.find().sort({ date: 1 });
      console.log(`Found ${appointments.length} appointments in MongoDB`);
    } else {
      // Otherwise, use in-memory storage
      appointments = inMemoryDB.appointments;
      console.log(`Found ${appointments.length} appointments in memory`);
    }
    
    res.json(appointments);
  } catch (err) {
    console.error('Error getting appointments:', err);
    // Return in-memory data as fallback
    res.json(inMemoryDB.appointments);
  }
});

// Check availability
router.get('/check-availability', async (req, res) => {
  try {
    const { date, time } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({ 
        message: 'Date and time are required parameters' 
      });
    }
    
    let isAvailable = true;
    
    if (isMongoConnected()) {
      // Try to find conflict in MongoDB
      const existingAppointment = await Appointment.findOne({
        date: new Date(date),
        time: time,
        status: { $in: ['pending', 'confirmed'] }
      }).maxTimeMS(2000); // Set a lower timeout
      
      isAvailable = !existingAppointment;
    } else {
      // Check in-memory storage
      const conflict = inMemoryDB.appointments.find(apt => 
        new Date(apt.date).toDateString() === new Date(date).toDateString() && 
        apt.time === time &&
        ['pending', 'confirmed'].includes(apt.status)
      );
      
      isAvailable = !conflict;
    }
    
    res.json({ 
      available: isAvailable,
      message: isAvailable ? 'Time slot is available' : 'Time slot is already booked'
    });
  } catch (err) {
    console.error('Error checking availability:', err);
    // If error, assume available (better user experience than blocking all slots)
    res.json({ available: true, message: 'Time slot is available' });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    // Check if we have all required fields
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'service', 'date', 'time'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    
    const appointmentData = {
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      service: req.body.service,
      date: new Date(req.body.date),
      time: req.body.time,
      notes: req.body.notes || '',
      status: 'pending',
      createdAt: new Date()
    };
    
    let newAppointment;
    
    if (isMongoConnected()) {
      // Try to save to MongoDB
      newAppointment = await Appointment.create(appointmentData);
      console.log('Created appointment in MongoDB:', newAppointment);
    } else {
      // Save to in-memory storage
      newAppointment = {
        _id: Date.now().toString(),
        ...appointmentData
      };
      inMemoryDB.appointments.push(newAppointment);
      console.log('Created appointment in memory:', newAppointment);
    }
    
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    
    // Fallback to in-memory if MongoDB fails
    try {
      const newAppointment = {
        _id: Date.now().toString(),
        ...req.body,
        date: new Date(req.body.date),
        status: 'pending',
        createdAt: new Date()
      };
      inMemoryDB.appointments.push(newAppointment);
      console.log('Fallback: Created appointment in memory:', newAppointment);
      res.status(201).json(newAppointment);
    } catch (fallbackErr) {
      res.status(500).json({ message: 'Failed to create appointment' });
    }
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'declined', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    let updatedAppointment;
    
    if (isMongoConnected()) {
      // Try to update in MongoDB
      updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      
      if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
    } else {
      // Update in-memory
      const index = inMemoryDB.appointments.findIndex(a => a._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      inMemoryDB.appointments[index].status = status;
      updatedAppointment = inMemoryDB.appointments[index];
    }
    
    res.json(updatedAppointment);
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ message: 'Error updating appointment status' });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;
    
    if (isMongoConnected()) {
      // Try to delete from MongoDB
      const result = await Appointment.findByIdAndDelete(id);
      deleted = !!result;
    } else {
      // Delete from in-memory
      const index = inMemoryDB.appointments.findIndex(a => a._id === id);
      if (index !== -1) {
        inMemoryDB.appointments.splice(index, 1);
        deleted = true;
      }
    }
    
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ message: 'Error deleting appointment' });
  }
});

module.exports = router;
