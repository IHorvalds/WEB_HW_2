const mongoose = require('mongoose');
const Photo = require('./Photo');

const cameraSchema = new mongoose.Schema({
    owner: mongoose.Schema.ObjectId,
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    add_date: {
        type: Date,
        default: Date.now
    },
    is_digital: { // false -> film camera; true -> digital camera
        type: Boolean,
        default: true
    },
    file: { // location for picture of camera
        type: String,
        required: false
    },
    photos: [{
        type: mongoose.Schema.ObjectId,
        ref: Photo
    }]
});

module.exports = mongoose.model('Camera', cameraSchema);