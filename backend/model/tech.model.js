const mongoose = require("mongoose");

const techSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Add a case-insensitive unique index for name
techSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model("Tech", techSchema); 