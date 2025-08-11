const express = require('express');
const router = express.Router();
const {createRegisterUser, getAllRegisterUsers, getRegisterUserById, updateRegisterUser, deleteRegisterUser , loginRegisterUser, sendOTP, verifyPasswordResetOTP, resetPassword} = require('../controller/register.controller');
const upload = require('../middleware/upload');


// Create a new question
router.post("/register", upload.single("profileImage"), createRegisterUser);


// Get all  with populated tech_Id
router.get('/', getAllRegisterUsers);

// Get single question by ID with populated tech_Id
router.get('/:id', getRegisterUserById);

// Update question by ID
router.put('/:id',upload.single("profileImage"), updateRegisterUser);

// Delete question by ID
router.delete('/:id', deleteRegisterUser);

// Login user
router.post('/login', loginRegisterUser);

// send otp
router.post('/sendotp', sendOTP);

router.post('/verifyotp', verifyPasswordResetOTP);

router.post('/resetpass', resetPassword);

module.exports = router;
