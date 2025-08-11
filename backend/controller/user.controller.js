const User = require('../model/user.model'); // Adjust path if needed
const Question = require('../model/question.model');
const Quiz = require('../model/quiz.model');

const joinQuiz = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({ message: 'User already exists, joined quiz', user });
        }

        // Create new user
        user = await User.create({ email });

        res.status(201).json({ message: 'User created and joined quiz successfully', user });

    } catch (error) {
        console.error('Error in joinQuiz:', error.message);
        res.status(500).json({ message: 'Failed to join quiz' });
    }
};




// Submit quiz answers and calculate time
exports.submitQuiz = async (req, res) => {
    try {
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
// Quiz Login by Email
const db_loginQuiz = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email required" });
        }

        // Find quiz by email and populate question details
        const quiz = await Quiz.findOne({ email: email.trim() })
            .populate({
                path: 'questions.question_id',
                select: 'Question options answer difficulty' // Add answer field for correct answers
            })
            .populate('tech_Id', 'name'); // Optional: tech name

        if (!quiz) {
            return res.status(404).json({ success: false, message: "User not found or quiz not found" });
        }

        // Return quiz details with questions & correct answers
        return res.json({
            success: true,
            message: "Quiz login successful",
            user: {
                _id: quiz._id,
                email: quiz.email,
                tech_Id: quiz.tech_Id,
                totalQuestions: quiz.questions.length
            },
            questions: quiz.questions.map(q => ({
                question_id: q.question_id._id,
                question: q.question_id.Question,
                options: q.question_id.options,
                correctAnswer: q.question_id.answer, // correct answer
                difficulty: q.question_id.difficulty,
                user_answer: q.user_answer,
                status: q.status
            }))
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    joinQuiz,
    db_loginQuiz
}