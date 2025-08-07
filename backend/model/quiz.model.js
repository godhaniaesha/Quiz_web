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
    }
}, {
    timestamps: true // createdAt અને updatedAt auto add થાય
});

module.exports = mongoose.model("Quiz", quizSchema);