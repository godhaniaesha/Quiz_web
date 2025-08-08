
const Register = require("../model/register.model");
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

module.exports = {
    createRegisterUser,
    getAllRegisterUsers,
    getRegisterUserById,
    updateRegisterUser,
    deleteRegisterUser,
    loginRegisterUser
};
