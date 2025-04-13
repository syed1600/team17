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
    res.status(500).json({ message: err.message });
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
    
    // Find any appointments at the requested date and time
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      time: time,
      status: { $in: ['pending', 'confirmed'] } // Only check pending and confirmed appointments
    });
    
    res.json({ 
      available: !existingAppointment,
      message: existingAppointment ? 'Time slot is already booked' : 'Time slot is available'
    });
  } catch (err) {
    console.error('Error checking availability:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Getting appointment by ID:', req.params.id);
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      console.log('Appointment not found');
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    console.error('Error getting appointment:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  console.log('Creating new appointment with data:', req.body);
  
  try {
    // Check if we have all required fields
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'service', 'date', 'time'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    
    // Check if the time slot is already booked
    const existingAppointment = await Appointment.findOne({
      date: new Date(req.body.date),
      time: req.body.time,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(409).json({ 
        message: 'This time slot is already booked. Please select a different time.'
      });
    }
    
    // Create the appointment
    const appointmentData = {
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      service: req.body.service,
      date: new Date(req.body.date),
      time: req.body.time,
      notes: req.body.notes || '',
      status: 'pending'
    };
    
    const newAppointment = await Appointment.create(appointmentData);
    console.log('Created appointment:', newAppointment);
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    console.log('Updating appointment status:', req.params.id, req.body.status);
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      console.log('Appointment not found');
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = req.body.status;
    const updatedAppointment = await appointment.save();
    console.log('Updated appointment:', updatedAppointment);
    res.json(updatedAppointment);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting appointment:', req.params.id);
    const result = await Appointment.findByIdAndDelete(req.params.id);
    if (!result) {
      console.log('Appointment not found');
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    console.log('Appointment deleted');
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
