const Quiz = require('../model/quiz.model');

// 1️⃣ Create new quiz
const createQuiz = async (req, res) => {
    try {
        const { email, tech_Id } = req.body;

        if (!email || !tech_Id || !Array.isArray(tech_Id)) {
            return res.status(400).json({
                success: false,
                message: "Email and tech_Id array are required"
            });
        }

        const quiz = await Quiz.create({ email, tech_Id });
        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: quiz
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating quiz", error: error.message });
    }
};

// 2️⃣ Get all quizzes
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("tech_Id"); // Optional populate
        res.status(200).json({
            success: true,
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching quizzes", error: error.message });
    }
};

// 3️⃣ Get quiz by ID
const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id).populate("tech_Id");

        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching quiz", error: error.message });
    }
};

// 4️⃣ Update quiz
const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, tech_Id, status } = req.body;

        const quiz = await Quiz.findByIdAndUpdate(
            id,
            { email, tech_Id, status },
            { new: true }
        );

        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }

        res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            data: quiz
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating quiz", error: error.message });
    }
};

// 5️⃣ Delete quiz
const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Quiz.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting quiz", error: error.message });
    }
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz
};
