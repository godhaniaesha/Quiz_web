const express = require('express');
const router = express.Router();
const { 
    createQuiz, 
    getAllQuizzes, 
    getQuizById, 
    updateQuiz, 
    deleteQuiz,
    generateQuiz,
    submitQuiz
} = require('../controller/quiz.controller');

router.post('/generate', generateQuiz);
router.post('/submit', submitQuiz);

router.post('/', createQuiz);
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

module.exports = router;