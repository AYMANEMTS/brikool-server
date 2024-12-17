const express = require('express');
const router = express.Router();
const upload = require("../config/multerConfig");
const {getUserNotifications, markAsRead, clearAll, getUserUnreceivedNotifications, markAsReceived} = require('../controller/notification.controller')
const verifyToken = require("../middlewares/verifyToken");

router.get('/', upload.none(), verifyToken, getUserNotifications)
router.get('/unreceived', upload.none(), verifyToken, getUserUnreceivedNotifications)
router.post('/all-read', upload.none(), verifyToken, markAsRead);
router.post('/all-received', upload.none(), verifyToken, markAsReceived);
router.delete('/clear-all', upload.none(), verifyToken, clearAll);


module.exports = router
