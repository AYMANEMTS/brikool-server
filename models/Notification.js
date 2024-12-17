const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    relatedEntityId: { type: mongoose.Schema.Types.ObjectId, required: false },
    type: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    received: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
module.exports = Notification;

