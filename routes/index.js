const express = require('express');
const clientsRoutes = require('./client.route');
const authRoutes = require('./auth.route');
const googleAuthRoutes = require('./google-auth.route');
const categoryRoutes = require('./category.route');
const jobRoutes = require('./job.route');
const chatRoutes = require('./chat.route');
const notificationRoutes = require('./notification.route');
const permissionsRoutes = require('./permissions.route');
const adminRoutes = require('./admine.route');
const NotificationToken = require('../models/NotificationToken')

const router = express.Router();

router.use("/clients", clientsRoutes);
router.use("/", authRoutes);
router.use("/", googleAuthRoutes);
router.use("/categories", categoryRoutes);
router.use("/jobs", jobRoutes);
router.use("/chats", chatRoutes);
router.use("/notifications", notificationRoutes);
router.use("/permissions", permissionsRoutes);
router.use("/admin", adminRoutes);


router.post('/register-push-token', async (req, res) => {
    try {
        const { token, userId } = req.body;
        console.log('Registering push token:', { userId, token }); // Log the data
        if (!token || !userId) {
            return res.status(400).json({ message: 'Token and userId are required' });
        }

        let existingToken = await NotificationToken.findOne({ userId });
        if (existingToken) {
            existingToken.token = token;
            await existingToken.save();
            console.log('Updated existing token for user:', userId);
        } else {
            await NotificationToken.create({ userId, token });
            console.log('Created new token for user:', userId);
        }
        res.status(200).json({ message: 'Push token registered successfully' });
    } catch (error) {
        console.error('Error registering push token:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
