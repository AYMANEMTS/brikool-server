// multerConfig.js
const multer = require('multer');
const path = require('path');

// Set storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + path.extname(file.originalname)); // Append timestamp to filename to prevent duplicates
    },
});

// Create the multer instance
const upload = multer({ storage });

module.exports = upload; // Export the upload instance
