const Quiz = require('../model/quiz.model');
const Question = require('../model/question.model');
const mongoose = require('mongoose');

// Generate quiz with random questions from selected technologies
const generateQuiz = async (req, res) => {
    try {
        const { email, tech_Id } = req.body;
 
        if (!email || !tech_Id || !Array.isArray(tech_Id) || tech_Id.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Email and at least one technology ID are required'
            });
        }
 
        // Get total available questions for given techs
        const questionCount = await Question.countDocuments({
            tech_Id: { $in: tech_Id.map(id => new mongoose.Types.ObjectId(id)) },
            active: true
        });
 
        const questionSize = Math.min(30, questionCount);
 
        if (questionSize === 0) {
            return res.status(400).json({
                success: false,
                message: 'No questions available for selected technologies'
            });
        }
 
        // Pick 30 random questions from all selected techs
        const questions = await Question.aggregate([
            {
                $match: {
                    tech_Id: { $in: tech_Id.map(id => new mongoose.Types.ObjectId(id)) },
                    active: true
                }
            },
            { $sample: { size: questionSize } }
        ]);
 
        // Create quiz document
        const quiz = new Quiz({
            email,
            tech_Id,
            questions: questions.map(q => ({
                question_id: q._id,
                user_answer: '',
                status: 'unattempted'
            }))
        });
 
        await quiz.save();
 
        // Populate quiz
        const populatedQuiz = await Quiz.findById(quiz._id)
            .populate({
                path: 'questions.question_id',
                select: 'Question options difficulty'
            })
            .populate('tech_Id', 'name');
 
        res.status(201).json({
            success: true,
            quizzes: [populatedQuiz],
            startTime: new Date(),
            message: 'Quizzes generated successfully'
        });
 
    } catch (error) {
        console.error('Error generating quizzes:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating quizzes',
            error: error.message
        });
    }
};

// Submit quiz answers and calculate time
const submitQuiz = async (req, res) => {
    try {
        const { _id, answers, startTime } = req.body; // <-- using _id now

        if (!_id || !answers || !startTime) {
            return res.status(400).json({
                success: false,
                message: 'Quiz _id, answers, and start time are required'
            });
        }

        const quiz = await Quiz.findById(_id).populate('questions.question_id');
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        const endTime = new Date();
        const timeTaken = (endTime - new Date(startTime)) / 1000;

        let correctAnswers = 0;
        quiz.questions = quiz.questions.map((q, index) => {
            const userAnswer = answers[index];
            const correctAnswer = String(q.question_id.answer).trim().toLowerCase();
            const submittedAnswer = String(userAnswer).trim().toLowerCase();

            const isCorrect = correctAnswer === submittedAnswer;
            if (isCorrect) correctAnswers++;

            return {
                ...q.toObject(),
                user_answer: userAnswer,
                status: isCorrect ? 'correct' : 'incorrect',
                updatedAt: endTime
            };
        });

        quiz.status = 'inactive';
        await quiz.save();

        res.status(200).json({
            success: true,
            message: 'Quiz submitted successfully',
            result: {
                totalQuestions: quiz.questions.length,
                correctAnswers,
                wrongAnswers: quiz.questions.length - correctAnswers,
                timeTaken,
                score: (correctAnswers / quiz.questions.length) * 100
            }
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting quiz',
            error: error.message
        });
    }
};

// CRUD functions remain the same but also use _id instead of quizId

const createQuiz = async (req, res) => {
    try {
        const { email, tech_Id, questions } = req.body;
        const newQuiz = await Quiz.create({ email, tech_Id, questions });
        res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
    } catch (error) {
        console.error('Error creating quiz:', error.message);
        res.status(500).json({ message: 'Failed to create quiz' });
    }
};

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find()
            .populate('tech_Id')
            .populate('questions.question_id');
        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error.message);
        res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
};

const getQuizById = async (req, res) => {
    try {
        const { id } = req.params; // still works with _id
        const quiz = await Quiz.findById(id)
            .populate('tech_Id')
            .populate('questions.question_id');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error.message);
        res.status(500).json({ message: 'Failed to fetch quiz' });
    }
};

const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        updates['questions']?.forEach(q => {
            q.updatedAt = new Date();
        });

        const updatedQuiz = await Quiz.findByIdAndUpdate(id, updates, { new: true })
            .populate('tech_Id')
            .populate('questions.question_id');

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
    } catch (error) {
        console.error('Error updating quiz:', error.message);
        res.status(500).json({ message: 'Failed to update quiz' });
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error.message);
        res.status(500).json({ message: 'Failed to delete quiz' });
    }
};

module.exports = {
    generateQuiz,
    submitQuiz,
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz
};
