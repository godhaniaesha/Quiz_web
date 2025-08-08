
const Register = require("../model/register.model");
const twilioConfig = require('../config/twilio.config');
const bcrypt = require("bcryptjs");

// Create a new user
const createRegisterUser = async (req, res) => {
    try {
        const { email, password, phone_number, name, role, bio } = req.body;

        if (!email || !password || !phone_number) {
            return res.status(400).json({
                success: false,
                message: "Email, password and phone number are required"
            });
        }

        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Register.create({
            name,
            email,
            phone_number,
            password: hashedPassword,
            role: role || "user",
            bio,
            profileImage: req.file ? req.file.filename : ""
        });

        const safeUser = await Register.findById(user._id).select("-password -refreshToken");

        res.status(201).json({
            success: true,
            data: safeUser,
            message: "User created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message
        });
    }
};

// Get all users
const getAllRegisterUsers = async (req, res) => {
    try {
        const users = await Register.find().select("-password -refreshToken");
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};

// Get single user by ID
const getRegisterUserById = async (req, res) => {
    try {
        const user = await Register.findById(req.params.id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
};

// Update user by ID
const updateRegisterUser = async (req, res) => {
    try {
        const updateData = req.body;

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        if (req.file) {
            updateData.profileImage = req.file.filename;
        }

        const updatedUser = await Register.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password -refreshToken");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user",
            error: error.message
        });
    }
};

// Delete user by ID
const deleteRegisterUser = async (req, res) => {
    try {
        const user = await Register.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

// Login user
const loginRegisterUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        const safeUser = await Register.findById(user._id).select("-password -refreshToken");

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: safeUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

// Send otp
const sendOTP = async (req, res) => {
    const { phone_number } = req.body;
    console.log(phone_number,":sxdrghdf");

     const user = await Register.findOne({ phone_number });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this phone_number"
            });
        }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP for password reset:", otp);
    // console.log("User email:", email);

    // Save OTP to user document with expiry (10 minutes)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const updatedUser = await Register.findByIdAndUpdate(user._id, {
        $set: {
            resetPasswordOTP: otp.toString(),
            resetPasswordExpiry: otpExpiry,
            otpVerified: false
        }
    }, { new: true });

    console.log("Updated user with OTP:", updatedUser.resetPasswordOTP);
    console.log("OTP expiry:", updatedUser.resetPasswordExpiry);


    try {
        const client = twilioConfig.getClient();
        const formattedPhone = phone_number.startsWith('+91') ? phone_number : `+91${phone_number}`;

        await client.messages.create({
            body: `Your password reset OTP is: ${otp}. Valid for 10 minutes.`,
            to: formattedPhone,
            from: twilioConfig.phoneNumber
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to your registered mobile number"
        });
    } catch (twilioError) {
        console.error("Twilio Error:", twilioError);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP via SMS",
            error: twilioError.message || twilioError
        });
    }
};

const verifyPasswordResetOTP = async (req, res) => {
    try {
        const { phone_number, otp } = req.body;

        if (!phone_number || !otp) {
            return res.status(400).json({
                success: false,
                message: "phone_number and OTP are required"
            });
        }

        // Find user by phone_number
        const user = await Register.findOne({ phone_number });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("User found:", user.phone_number);
        console.log("Stored OTP:", user.resetPasswordOTP);
        console.log("Received OTP:", otp);
        console.log("OTP Expiry:", user.resetPasswordExpiry);

        // Check if OTP exists and is not expired
        if (!user.resetPasswordOTP) {
            return res.status(400).json({
                success: false,
                message: "No OTP found. Please request a new OTP."
            });
        }

        // Check if OTP is expired
        if (user.resetPasswordExpiry && new Date() > new Date(user.resetPasswordExpiry)) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP."
            });
        }

        // Verify OTP - convert both to strings for comparison
        const storedOTP = user.resetPasswordOTP.toString();
        const receivedOTP = otp.toString();
        
        console.log("Comparing OTPs:");
        console.log("Stored OTP (string):", storedOTP);
        console.log("Received OTP (string):", receivedOTP);
        console.log("Are they equal?", storedOTP === receivedOTP);

        if (storedOTP !== receivedOTP) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Clear OTP after successful verification
        await Register.findByIdAndUpdate(user._id, {
            $set: {
                resetPasswordOTP: null,
                resetPasswordExpiry: null,
                otpVerified: true
            }
        });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({
            success: false,
            message: "OTP verification failed",
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { phone_number, newPassword } = req.body;

        if (!phone_number || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "phone_number and new password are required"
            });
        }

        // Find user by phone_number
        const user = await Register.findOne({ phone_number });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if OTP was verified
        if (!user.otpVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify OTP first"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear verification flags
        await Register.findByIdAndUpdate(user._id, {
            $set: {
                password: hashedPassword,
                otpVerified: false
            }
        });

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: error.message
        });
    }
};

module.exports = {
    createRegisterUser,
    getAllRegisterUsers,
    getRegisterUserById,
    updateRegisterUser,             
    deleteRegisterUser,
    loginRegisterUser,
    sendOTP,
    verifyPasswordResetOTP,
    resetPassword
};
