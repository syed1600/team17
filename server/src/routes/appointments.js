const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    console.log('Getting all appointments');
    const appointments = await Appointment.find().sort({ date: 1 });
    console.log(`Found ${appointments.length} appointments`);
    
    // If using Mongoose model, convert to plain objects
    const plainAppointments = appointments.map(app => 
      typeof app.toObject === 'function' ? app.toObject() : app
    );
    
    console.log('Sending appointments data');
    res.json(plainAppointments);
  } catch (err) {
    console.error('Error getting appointments:', err);
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
    
    // Create the appointment object
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
    
    // Create the appointment
    const newAppointment = await Appointment.create(appointmentData);
    console.log('Created appointment:', newAppointment);
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(400).json({ message: err.message });
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
    
    if (typeof appointment.status === 'string') {
      appointment.status = req.body.status;
      const updatedAppointment = await appointment.save();
      console.log('Updated appointment:', updatedAppointment);
      res.json(updatedAppointment);
    } else {
      // For in-memory model
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id, 
        { status: req.body.status },
        { new: true }
      );
      console.log('Updated appointment:', updatedAppointment);
      res.json(updatedAppointment);
    }
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
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
