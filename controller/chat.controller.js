const Chat = require('../models/Chat');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create or get an existing chat between two users
const getChat = async (req, res) => {
    const {userId2 } = req.params;
    try {
        const user = await User.findById(req.userId)
        let chat = await Chat.findOne({ participants: { $all: [user._id, userId2] } })
        .populate('participants', 'name image')
        if (!chat) {
            // Create new chat if none exists
            chat = new Chat({ participants: [user._id, userId2] });
            await chat.save();
        }
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching chat' });
    }
};

// Send a message
const sendMessage = async (req, res) => {
    const { chatId } = req.params;
    const { senderId, content, recipientId  } = req.body;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        const newMessage = { sender: senderId, content };
        chat.messages.push(newMessage);
        chat.lastMessage = content;
        chat.updatedAt = Date.now();
        await chat.save();
        const user = await User.findById(senderId);
        const newNotification = new Notification({
            userId: recipientId,  // Notification for the recipient
            senderId: user._id,
            type: 'message',
            content: `You have a new message from ${user.name}`,
            relatedEntityId: chatId,  // Reference to the chat
            createdAt: Date.now()
        });

        await newNotification.save();

        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error sending message' });
    }
};

// Fetch all chats for a user
const getUserChats = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const chats = await Chat.find({ participants: user._id })
            .populate('participants', 'name image')  // Get participant details
            .sort({ updatedAt: -1 });  // Sort by latest messages
        if (!chats.length) {
            return res.status(404).json({ message: 'No chats found for this user' });
        }
        res.status(200).json(chats)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching chats user' });
    }
};


module.exports = { getChat, sendMessage, getUserChats };
