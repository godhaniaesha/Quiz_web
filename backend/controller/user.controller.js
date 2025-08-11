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



module.exports = {
    joinQuiz
}