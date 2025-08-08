const mongoose = require("mongoose");


const questionSchema = mongoose.Schema({
    Question: {
        type: String,
        required: true,
        unique: true
    },
    options: {
        type: [String], // a, b, c, d
        validate: {
            validator: function (v) {
                return v.length === 4;
            },
            message: props => `Options must contain exactly 4 values (a, b, c, d)!`
        },
        required: true
    },
    answer: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return ['a', 'b', 'c', 'd'].includes(v);
            },
            message: props => `Answer must be one of 'a', 'b', 'c', 'd'!`
        }
    },
    tech_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tech',
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model("question", questionSchema);
