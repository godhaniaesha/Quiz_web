const express = require('express');
const router = express.Router();
const { createQuiz, getAllQuizzes, getQuizById, updateQuiz, deleteQuiz } = require('../controller/quiz.controller');


router.post('/', createQuiz);
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

module.exports = router;