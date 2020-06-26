const mongoose = require('mongoose');
const Camera = require('./Camera');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        max: 64,
        min: 8
    },
    signup_date: {
        type: Date,
        default: Date.now
    },
    prefers_digital: { // false -> usually shoots film; true -> usually shoots digital
        type: Boolean,
        default: true
    },
    cameras: [{
        type: mongoose.Schema.ObjectId,
        ref: Camera
    }]
});

module.exports = mongoose.model('User', userSchema);