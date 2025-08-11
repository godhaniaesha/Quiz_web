const Quiz = require('../model/quiz.model');
const Question = require('../model/question.model');
const mongoose = require('mongoose');

// Generate quiz with random questions from selected technologies
const generateQuiz = async (req, res) => {
    try {
        const { email, tech_Id } = req.body;
        console.log(email, tech_Id, "jjjjjjjjj");

        // Validate input
        if (!email || !tech_Id || !Array.isArray(tech_Id) || tech_Id.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Email and at least one technology ID are required'
            });
        }

        const quizzes = [];

        // Generate separate quiz for each technology
        for (const techId of tech_Id) {
            // First, count available questions
            const questionCount = await Question.countDocuments({
                tech_Id: new mongoose.Types.ObjectId(techId),
                active: true
            });

            // Get all available questions if less than 30, otherwise get 30
            const questionSize = Math.min(30, questionCount);

            if (questionSize === 0) {
                return res.status(400).json({
                    success: false,
                    message: `No questions available for technology ID: ${techId}`
                });
            }

            // Get random questions
            const questions = await Question.aggregate([
                {
                    $match: {
                        tech_Id: new mongoose.Types.ObjectId(techId),
                        active: true
                    }
                },
                { $sample: { size: questionSize } }
            ]);

            // Create quiz for this technology
            const quiz = new Quiz({
                email,
                tech_Id: [techId],
                questions: questions.map(q => ({
                    question_id: q._id,
                    user_answer: '',
                    status: 'unattempted'
                }))
            });

            await quiz.save();

            // Populate quiz details
            const populatedQuiz = await Quiz.findById(quiz._id)
                .populate({
                    path: 'questions.question_id',
                    select: 'Question options difficulty'
                })
                .populate('tech_Id', 'name');

            quizzes.push(populatedQuiz);
        }

        res.status(201).json({
            success: true,
            quizzes: quizzes,
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
        console.log('Request body:', req.body); // Add this line for debugging

        const { quizId, answers, startTime } = req.body;

        // Validate input
        if (!quizId || !answers || !startTime) {
            return res.status(400).json({
                success: false,
                message: 'Quiz ID, answers, and start time are required'
            });
        }

        const quiz = await Quiz.findById(quizId).populate('questions.question_id');
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Calculate time taken
        const endTime = new Date();
        const timeTaken = (endTime - new Date(startTime)) / 1000; // in seconds

        // Update answers and check correctness
        let correctAnswers = 0;
        quiz.questions = quiz.questions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = q.question_id.answer === userAnswer;
            if (isCorrect) correctAnswers++;

            return {
                ...q,
                user_answer: userAnswer,
                status: isCorrect ? 'correct' : 'incorrect',
                updatedAt: endTime
            };
        });

        quiz.status = 'inactive'; // Mark quiz as completed
        await quiz.save();

        res.status(200).json({
            success: true,
            message: 'Quiz submitted successfully',
            result: {
                totalQuestions: 30,
                correctAnswers,
                timeTaken,
                score: (correctAnswers / 30) * 100
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

// 1️⃣ Create new quiz
const createQuiz = async (req, res) => {
    try {
        const { email, tech_Id, questions } = req.body;

        const newQuiz = await Quiz.create({
            email,
            tech_Id,
            questions
        });

        res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
    } catch (error) {
        console.error('Error creating quiz:', error.message);
        res.status(500).json({ message: 'Failed to create quiz' });
    }
};


// 2️⃣ Get all quizzes
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

// 3️⃣ Get quiz by ID
const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;

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

// 4️⃣ Update quiz
const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        updates['questions']?.forEach(q => {
            q.updatedAt = new Date(); // update timestamp if question updated
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

// 5️⃣ Delete quiz
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
