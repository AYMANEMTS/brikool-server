const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const UserSchema = mongoose.Schema( {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
    city: { type: {
            fr: { type: String, required: true, minlength: 1, maxlength: 50 },
            ar: { type: String, required: true, minlength: 1, maxlength: 50 },
            en: { type: String, required: true, minlength: 1, maxlength: 50 },
        },
        required: false
    },
    googleId: { type: String, required: false },
    secret: { type: String, required: false },
    role: { type: String, default: "client" },
    status: {
        type: String,
        enum: ['verified', 'unverified', 'suspended'],
        default: 'unverified'
    },
    permissions: { type: [String], default: [], required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    verificationToken: { type: String, required: false },
    verificationExpires: { type: Date, required: false },
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
    next()
})

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;
