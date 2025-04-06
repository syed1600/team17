const express = require('express');
const router = express.Router();

// Placeholder for database model - you'll need to create this
// const Appointment = require('../models/appointment');

// Get all appointments
router.get('/', (req, res) => {
  // Temporary response until database is connected
  res.json([
    {
      _id: '1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '555-123-4567',
      service: 'haircut',
      date: new Date('2025-04-15'),
      time: '10:00 AM',
      status: 'pending',
      notes: 'First time customer',
      createdAt: new Date()
    }
  ]);
});

// Create a new appointment
router.post('/', (req, res) => {
  // Temporary response until database is connected
  res.status(201).json({
    _id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    createdAt: new Date()
  });
});

// Update appointment status
router.patch('/:id/status', (req, res) => {
  res.json({
    _id: req.params.id,
    status: req.body.status,
    updatedAt: new Date()
  });
});

// Delete an appointment
router.delete('/:id', (req, res) => {
  res.json({ message: 'Appointment deleted' });
});

module.exports = router;
