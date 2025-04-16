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

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// In-memory storage as fallback
const inMemoryDB = {
  appointments: []
};

// MongoDB connection with improved options
const connectDB = async () => {
  try {
    // Use better connection options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Socket timeout
      connectTimeoutMS: 10000, // Connection timeout
    });
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return false;
  }
};

// Import routes
const appointmentRoutes = require('./routes/appointments');

// Routes
app.use('/api/appointments', appointmentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Barbershop booking API is running',
    database: mongoose.connection.readyState === 1 ? 'MongoDB' : 'In-memory'
  });
});

// Start server
const startServer = async () => {
  // Try to connect to MongoDB
  const isConnected = await connectDB();
  
  if (!isConnected) {
    console.log('Using in-memory database as fallback');
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using database: ${mongoose.connection.readyState === 1 ? 'MongoDB' : 'In-memory'}`);
  });
};

// Export for use in other files
module.exports = { inMemoryDB };

// Start the server
startServer();
