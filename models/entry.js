const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description of lost time is required']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
        // Consider enum for specific values if using dropdown strictly
    },
    emotion: {
        type: String,
        required: [true, 'Emotion is required']
        // Consider enum for emojis: ['😡', '😅', '😢', '😴', '🤷']
    },
    wouldDoAgain: {
        type: String,
        required: [true, 'Would you do it again? is required'],
        enum: ['Yes', 'No', 'Maybe']
    },
    tags: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    // Add any other fields based on your concept, e.g., regrets score
});

module.exports = mongoose.model('Entry', entrySchema); 