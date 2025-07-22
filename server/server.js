require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const chatRoutes = require('./routes/chatRoutes');
const leadRoutes = require('./routes/leadRoutes');
const configRoutes = require('./routes/configRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Set port
const PORT = process.env.PORT || 5000;


// Webhook route is now handled by whatsappRoutes
// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/lead', leadRoutes);
app.use('/api/config', configRoutes);
app.use('/webhook/whatsapp', whatsappRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes