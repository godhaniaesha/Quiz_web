const Question = require('../model/question.model');

// Create questions
const createQuestion = async (req, res) => {
    try {
        const { Question: questionText, options, answer, tech_Id, difficulty } = req.body;

        // Validate answer against options
        const validAnswers = ['a', 'b', 'c', 'd'];
        if (!validAnswers.includes(answer)) {
            return res.status(400).json({ message: "Answer must be one of 'a', 'b', 'c', or 'd'" });
        }

        const question = new Question({
            Question: questionText,
            options,
            answer,
            tech_Id,
            difficulty
        });

        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('tech_Id') // Populate full tech object
            .exec();

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get question by ID
const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id)
            .populate('tech_Id') // Populate full tech object
            .exec();

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update question
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedQuestion = await Question.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete question
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Question.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
};