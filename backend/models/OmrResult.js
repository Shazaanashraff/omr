const mongoose = require('mongoose');

const OmrResultSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    answers: { type: Object, required: true }, // dictionary format
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OmrResult', OmrResultSchema);
