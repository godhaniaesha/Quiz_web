const express = require('express');
const router = express.Router();
const { joinQuiz } = require('../controller/user.controller');


router.post('/', joinQuiz);

module.exports = router;