const express = require('express');
const router = express.Router();
const Entry = require('../models/entry');

// GET /api/entries - get all entries
router.get('/', async (req, res) => {
    try {
        const entries = await Entry.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(entries);
    } catch (err) {
        console.error('Error fetching entries:', err);
        res.status(500).json({ message: 'Failed to retrieve entries', error: err.message });
    }
});

// POST /api/entries - add a new entry
router.post('/', async (req, res) => {
    const {
        description,
        duration,
        emotion,
        wouldDoAgain,
        tags
    } = req.body;

    // Basic validation
    if (!description || !duration || !emotion || !wouldDoAgain) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const newEntry = new Entry({
        description,
        duration,
        emotion,
        wouldDoAgain,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : [])
    });

    try {
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        console.error('Error saving entry:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ message: 'Failed to save entry', error: err.message });
    }
});

// Optional: PUT /api/entries/:id - edit an entry
router.put('/:id', async (req, res) => {
    try {
        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json(updatedEntry);
    } catch (err) {
        console.error('Error updating entry:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ message: 'Failed to update entry', error: err.message });
    }
});

// Optional: DELETE /api/entries/:id - delete an entry
router.delete('/:id', async (req, res) => {
    try {
        const deletedEntry = await Entry.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json({ message: 'Entry deleted successfully' });
    } catch (err) {
        console.error('Error deleting entry:', err);
        res.status(500).json({ message: 'Failed to delete entry', error: err.message });
    }
});

module.exports = router; 