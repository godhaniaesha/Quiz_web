const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    tech_Id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tech",
        required: true
    }],
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"]
    },
    questions: [{
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "question",
            required: true
        },
        user_answer: {
            type: String
        },
        status: {
            type: String,
            enum: ["correct", "incorrect", "unattempted"],
            default: "unattempted"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Quiz", quizSchema);
