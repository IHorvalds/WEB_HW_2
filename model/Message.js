const mongoose = require('mongoose');
const User = require('./User');

const messageSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: User
    },
    title: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    content: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    state: {
        type: Number,
        enum: [0, 1, 2, 3], //awesome, angry, anxious, relaxed
        required: true
    },
    add_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);