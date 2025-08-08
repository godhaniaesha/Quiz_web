const Quiz = require('../model/quiz.model');

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
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz
};
