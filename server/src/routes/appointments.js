const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointment', error: err.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    const newAppointment = await Appointment.create(req.body);
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating appointment', error: err.message });
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'declined', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const updatedAppointment = await Appointment.updateStatus(req.params.id, status);
    
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: 'Error updating appointment status', error: err.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Appointment.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting appointment', error: err.message });
  }
});

module.exports = router;
