// models/NotificationToken.js
const mongoose = require('mongoose');

const NotificationTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
});

module.exports = mongoose.model('NotificationToken', NotificationTokenSchema);
