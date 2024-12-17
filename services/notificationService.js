// server/notificationService.js
const { Expo } = require('expo-server-sdk');
const NotificationToken = require('../models/NotificationToken');

const expo = new Expo();

async function sendPushNotification(userId, message) {
    try {
        const userToken = await NotificationToken.findOne({ userId });

        if (!userToken) {
            console.error(`No push token for user with ID: ${userId}`);
            return;
        }

        console.log('Sending notification to token:', userToken.token);

        if (!Expo.isExpoPushToken(userToken.token)) {
            console.error(`Push token ${userToken.token} is not a valid Expo push token`);
            return;
        }

        const messages = [{
            to: userToken.token,
            sound: 'default',
            title: message.title,
            body: message.body,
            data: message.data,
        }];

        const ticketChunk = await expo.sendPushNotificationsAsync(messages);
        console.log('Notification sent:', ticketChunk);
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
}

module.exports = { sendPushNotification };
