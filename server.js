const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = 'mongodb+srv://infoalunos5:8yf6vyMStda0KUwT@aniver.po4fzri.mongodb.net/?retryWrites=true&w=majority&appName=aniver';
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

// Attendee Schema and Model
const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Attendee = mongoose.model('Attendee', attendeeSchema);

// Routes

// POST /api/confirm - Confirm presence
app.post('/api/confirm', async (req, res) => {
  try {
    const names = req.body.names; // Assuming the frontend sends an array of names

    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one name.' });
    }

    const attendeesToSave = names.map(name => ({
      name: name,
      timestamp: new Date() // Use current time for each entry
    }));

    await Attendee.insertMany(attendeesToSave);

    res.status(201).json({ message: 'Presence confirmed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/attendees - Get all attendees
app.get('/api/attendees', async (req, res) => {
  try {
    const attendees = await Attendee.find().sort({ timestamp: -1 });
    res.json(attendees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`)); 