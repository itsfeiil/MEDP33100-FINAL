const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const entryRoutes = require('./routes/entries');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB Connection (replace with your connection string)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/archiveOfLostTime';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/entries', entryRoutes);

// Basic route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 