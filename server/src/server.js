const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const appointmentRoutes = require('./routes/appointments');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointments', appointmentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Barbershop booking API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
