    const mongoose = require('mongoose');

    const MessageSchema = new mongoose.Schema({
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    });

    const ChatSchema = new mongoose.Schema({
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
        messages: [MessageSchema],
        lastMessage: { type: String },
        updatedAt: { type: Date, default: Date.now },
    });

    module.exports = mongoose.model('Chat', ChatSchema);