const express = require('express');
const router = express.Router();
const { joinQuiz } = require('../controller/user.controller');
const { generateQuiz, submitQuiz } = require('../controller/quiz.controller');


router.post('/', joinQuiz);
router.post('/generate-quiz', generateQuiz);
router.post('/submit-quiz', submitQuiz);

module.exports = router;