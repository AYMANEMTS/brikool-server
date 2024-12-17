const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    appel: { type: String, required: true },
    whatssap: { type: String, default: "" },
    email: { type: String, default: "" },
    linkedin: { type: String, default: "" }
});

const JobSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: {type: String, required:true,min:10},
    contacts: { type: ContactSchema, required: false },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'], // Define the allowed values for the enum
        default: 'active' // Set the default value
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    ratings : [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now }
    }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        comment: { type: String, required: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now }
    }],
   
},{timestamps: true})

// Virtual field for calculating the average rating
JobSchema.virtual('averageRating').get(function() {
    if (this.ratings.length === 0) return 0;
    const totalRating = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return totalRating / this.ratings.length;
});

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
module.exports = Job;


