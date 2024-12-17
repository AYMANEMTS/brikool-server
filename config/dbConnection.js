const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_SECRET_KEY);
        console.log('Connected to DB');
    } catch (error) {
        console.error('Connection Failed', error);
    }
};

module.exports = connectDB;
