const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    camera: mongoose.Schema.ObjectId,
    title: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    file: {
        type: String,
        required: true
    },
    dateTaken: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    },
    film: {
        type: String
    },
    iso: {
        type: Number
    }
});

module.exports = mongoose.model('Photo', photoSchema);