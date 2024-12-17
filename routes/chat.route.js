const express = require('express');
const { getChat, sendMessage, getUserChats } = require('../controller/chat.controller');
const router = express.Router();
const upload = require('../config/multerConfig');
const verifyToken = require("../middlewares/verifyToken");

router.get('/chats-user', upload.none(), verifyToken, getUserChats); // Get all chats for a user
router.post('/:chatId/messages', upload.none(), verifyToken, sendMessage); // Send message
router.get('/:userId2',upload.none(),verifyToken, getChat); // Get chat between two users

module.exports = router;
