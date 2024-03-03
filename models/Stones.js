const mongoose = require("mongoose");

const stonesSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        required: true,
        minLength: 2,
    },
    category: {
        type: String,
        required: true,
        minLength: 3,
    },
    color: {
        type: String,
        required: true,
        minLength: 2,
    },
    image: {
        type: String,
        required: true,
        match: /^(http|https):\/\//gm,
    },
    location: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 15
    },
    formula: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    description: {
        type: String,
        required: true,
        minLength: 10
    },
    likedList: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

const Stones = mongoose.model("Stones", stonesSchema);

module.exports = Stones;