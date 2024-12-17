const Notification = require('../models/Notification')
const User = require("../models/User");

const getUserNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const notifications = await Notification.find({ userId:user._id }).sort({ createdAt: -1 }).populate("senderId")

        const groupedNotifications = notifications.reduce((acc, notification) => {
            const key = `${notification.type}-${notification.senderId._id}-${notification.relatedEntityId}-${notification.read}`;
            if (!acc[key]) {
                acc[key] = {
                    ...notification.toObject(), // Convert Mongoose doc to plain object
                    count: 1,
                    notificationIds: [notification._id] // Initialize array for notification IDs
                };
            } else {
                acc[key].count += 1; // Increment the counter for this group
                acc[key].notificationIds.push(notification._id); // Add current notification ID
            }

            return acc;
        }, {});

        // Convert grouped notifications object into an array
        const groupedNotificationsArray = Object.values(groupedNotifications);
        res.status(200).json(groupedNotificationsArray);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

const getUserUnreceivedNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const unreceivedNotification = await Notification.find({userId:user._id, received: false})
        res.status(200).json(unreceivedNotification)
    }catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error getting unreceived notifications' });
    }
}

const markAsReceived = async (req, res) => {
    try {
        const { notificationsIds } = req.body;
        if (!Array.isArray(notificationsIds) || notificationsIds.length === 0) {
            return res.status(400).json({ message: 'notificationIds is empty or invalid' });
        }
        await Notification.updateMany(
            { _id: { $in: notificationsIds } },
            { received: true }
        );
        return res.status(200).json({
            message: "Notifications updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error marking notifications as received' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { notificationsIds } = req.body;
        if (!Array.isArray(notificationsIds) || notificationsIds.length === 0) {
            return res.status(400).json({ message: 'notificationIds is empty or invalid' });
        }
        await Notification.updateMany(
            { _id: { $in: notificationsIds } },
            { read: true }
        );
        return res.status(200).json({
            message: "Notifications updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error marking notifications as read' });
    }
};

const clearAll = async (req,res) => {
    try {
        const user = await User.findById(req.userId)
        await Notification.deleteMany({ userId: user._id });
        res.status(200).json({ message: 'All notifications cleared successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error delete notifications' });
    }
}

module.exports = {
    getUserNotifications,
    getUserUnreceivedNotifications,
    markAsReceived,
    markAsRead,
    clearAll,
};

