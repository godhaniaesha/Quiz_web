const express = require('express');
const router = express.Router();
const {createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion} = require('../controller/question.controller');



router.post('/', createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;