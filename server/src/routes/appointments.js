const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    console.log('Getting all appointments');
    const appointments = await Appointment.find().sort({ date: 1 });
    console.log(`Found ${appointments.length} appointments`);
    res.json(appointments);
  } catch (err) {
    console.error('Error getting appointments:', err);
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
});

// Check appointment availability
router.get('/check-availability', async (req, res) => {
  try {
    const { date, time } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({ 
        message: 'Date and time are required parameters' 
      });
    }
    
    // Find any appointments at the requested date and time
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    res.json({ 
      available: !existingAppointment,
      message: existingAppointment ? 'This time slot is already booked' : 'Time slot is available'
    });
  } catch (err) {
    console.error('Error checking availability:', err);
    res.status(500).json({ message: 'Error checking availability', error: err.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    console.log('Creating new appointment with data:', req.body);
    
    // Check if we have all required fields
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'service', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }
    
    // Create new appointment document
    const appointment = new Appointment({
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      service: req.body.service,
      date: new Date(req.body.date),
      time: req.body.time,
      notes: req.body.notes || '',
      status: 'pending'
    });
    
    // Save to database
    const newAppointment = await appointment.save();
    console.log('Created appointment:', newAppointment);
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'Failed to create appointment', error: err.message });
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'declined', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = status;
    const updatedAppointment = await appointment.save();
    
    res.json(updatedAppointment);
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ message: 'Error updating appointment status', error: err.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const result = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ message: 'Error deleting appointment', error: err.message });
  }
});

module.exports = router;
