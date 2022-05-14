const mongoose = require("mongoose")


const author = new mongoose.Schema({


    "firstName": {
        type: String,
        required: 'firstName is required',
        trim: true
    },
    "lastName": {
        type: String,
        required: 'lastName is required',
        trim: true
    },
    "title": {
        type: String,
        required: 'title is required',
        trim: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    "email": {
        type: String,
        required: 'email address is required',
        lowercase: true,
        unique: true,
        trim: true
    },
    "password": {
        type: String,
        required: 'password is required',
        min: 8,
        max: 15,
        trim: true
    }

}, { timestamps: true })

module.exports = mongoose.model("collectionOfAuthor", author)