const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "interviewer", "user"],
        default: "user"
    },
    profileImage: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
    },
    // OTP fields for password reset
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordExpiry: {
        type: Date,
        default: null
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("Register", registerSchema);
