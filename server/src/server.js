const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors());
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
console.log('Connecting to MongoDB...');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@4375.gmcyepa.mongodb.net/barbershop?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Import routes after establishing database connection
const appointmentRoutes = require('./routes/appointments');

// Routes
app.use('/api/appointments', appointmentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Barbershop booking API is running',
    dbConnected: mongoose.connection.readyState === 1
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connection state: ${mongoose.connection.readyState}`);
});
